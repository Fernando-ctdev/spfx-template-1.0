/**
 * ===============================================
 * MODO INTERATIVO
 * ===============================================
 *
 * Funções para o modo interativo do gerador,
 * com prompts para o usuário.
 *
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const { log } = require('../utils/logger');
const { getBasePath } = require('./file-helpers');
const { toKebabCase } = require('./utils');
const { generatePage } = require('./page');
const { generateComponent } = require('./component');
const { generateService } = require('./service');
const { generateHook } = require('./hook');
const { generateModel } = require('./model');

/**
 * Executa o modo interativo do gerador
 */
async function interactiveMode() {
  log.title('🎨 GERADOR INTERATIVO SPFx');
  
  // 1. Ler modo do projeto do .env
  let projectMode = 'page'; // default
  try {
    const basePath = getBasePath();
    const envPath = path.join(basePath, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/SPFX_MODE=(.*)/);
      if (match && match[1]) {
        projectMode = match[1].trim();
      }
    }
  } catch (e) {
    // Ignora erro, usa default
  }

  // 2. Filtrar opções baseado no modo
  const allChoices = [
    { title: 'Página (Page)', value: 'page', description: 'Nova tela com rota e componente' },
    { title: 'Componente (Component)', value: 'component', description: 'Componente React reutilizável' },
    { title: 'Serviço (Service)', value: 'service', description: 'Classe de serviço PnP/SharePoint' },
    { title: 'Hook (Hook)', value: 'hook', description: 'React Hook customizado (use...)' },
    { title: 'Modelo (Model)', value: 'model', description: 'Interface TypeScript' },
    { title: 'Sair', value: 'exit' }
  ];

  const availableChoices = projectMode === 'component' 
    ? allChoices.filter(c => c.value !== 'page') // Remove 'Page' se for modo Widget
    : allChoices;

  const { artifactType } = await prompts({
    type: 'select',
    name: 'artifactType',
    message: `O que você deseja criar? [Modo: ${projectMode.toUpperCase()}]`,
    choices: availableChoices
  });

  if (!artifactType || artifactType === 'exit') {
    log.info('Operação cancelada.');
    process.exit(0);
  }

  // Perguntas comuns
  let nameMessage = `Qual o nome do(a) ${artifactType}?`;
  
  // Para serviços, deixar claro que deve informar apenas o nome base (sem o sufixo "Service")
  if (artifactType === 'service') {
    nameMessage = `Qual o nome do serviço (apenas o nome base, sem "Service")?`;
  }
  
  // Para hooks, deixar claro que o prefixo "use" será adicionado automaticamente
  if (artifactType === 'hook') {
    nameMessage = `Qual o nome do hook (o prefixo "use" será adicionado automaticamente)?`;
  }
  
  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: nameMessage,
    validate: value => {
      if (value.length < 2) {
        return 'Nome muito curto (mínimo 2 caracteres)';
      }
      // Para serviços, verificar se o usuário informou o sufixo "Service"
      if (artifactType === 'service' && value.toLowerCase().endsWith('service')) {
        return 'Por favor, informe apenas o nome base (sem o sufixo "Service"). Exemplo: "Noticias" em vez de "NoticiasService"';
      }
      // Para hooks, verificar se o usuário informou o prefixo "use" (opcional, mas vamos avisar)
      if (artifactType === 'hook' && value.toLowerCase().startsWith('use')) {
        return 'O prefixo "use" será adicionado automaticamente. Informe apenas o nome base. Exemplo: "Noticias" em vez de "useNoticias"';
      }
      return true;
    }
  });

  if (!name) process.exit(0);

  // Perguntas específicas por tipo
  let options = {};

  if (artifactType === 'page') {
    const pageOptions = await prompts([
      {
        type: 'confirm',
        name: 'addRoute',
        message: 'Criar rota automaticamente no App.tsx?',
        initial: true
      },
      {
        type: 'text',
        name: 'route',
        message: 'Caminho da rota (ex: /minha-pagina)',
        initial: `/${toKebabCase(name)}`
      },
      {
        type: 'confirm',
        name: 'addToNav',
        message: 'Adicionar ao menu de navegação?',
        initial: true
      }
    ]);

    options = pageOptions;
  } 
  
  else if (artifactType === 'component') {
    const compOptions = await prompts([
      {
        type: 'confirm',
        name: 'withProps',
        message: 'Incluir interface de Props de exemplo?',
        initial: true
      }
    ]);
    options = compOptions;
  }
  
  else if (artifactType === 'service') {
    const serviceOptions = await prompts([
      {
        type: 'text',
        name: 'listName',
        message: 'Qual o nome da lista SharePoint que este serviço deve conectar?',
        initial: name, // O nome já está sem o sufixo "Service" devido à validação anterior
        validate: value => value.length < 2 ? 'Nome muito curto (mínimo 2 caracteres)' : true
      },
      {
        type: 'select',
        name: 'serviceType',
        message: 'Qual o tipo de serviço deseja criar?',
        choices: [
          { title: '📖 Apenas leitura', value: 'readonly', description: 'Gera apenas métodos de leitura (getAll, getById)' },
          { title: '✏️ CRUD completo', value: 'crud', description: 'Gera todos os métodos (getAll, getById, create, update, delete)' }
        ],
        initial: 0
      }
    ]);
    options = serviceOptions;
  }
  
  else if (artifactType === 'hook') {
    options = {};
  }

  // Executar Geração
  let result;
  switch (artifactType) {
    case 'page':
      result = await generatePage(name, options);
      if (result && result.filePath) showSummary('Página', result);
      else if (result && !result.filePath) log.info('⏭️  Operação cancelada pelo usuário.');
      break;
    case 'component':
      result = await generateComponent(name, options);
      if (result && result.filePath) showSummary('Componente', result);
      else if (result && !result.filePath) log.info('⏭️  Operação cancelada pelo usuário.');
      break;
    case 'service':
      result = await generateService(name, options);
      if (result && result.filePath) showSummary('Serviço', result);
      else if (result && !result.filePath) log.info('⏭️  Operação cancelada pelo usuário.');
      break;
    case 'hook':
      result = await generateHook(name);
      if (result && result.filePath) showSummary('Hook', result);
      else if (result && !result.filePath) log.info('⏭️  Operação cancelada pelo usuário.');
      break;
    case 'model':
      result = await generateModel(name);
      if (result && result.filePath) showSummary('Model', result);
      else if (result === false) log.info('⏭️  Operação cancelada pelo usuário.');
      break;
  }
}

/**
 * Mostra um resumo do que foi gerado
 * @param {string} type - Tipo do artefato
 * @param {object} result - Resultado da geração
 */
function showSummary(type, result) {
  const { colors } = require('../utils/logger');
  const basePath = getBasePath();
  
  console.log(`
${colors.cyan}┌─────────────────────────────────────────────────────┐
│           ✨ ${type} criado com sucesso!${' '.repeat(Math.max(0, 16 - type.length))}│
├─────────────────────────────────────────────────────┤${colors.reset}
│ ${colors.yellow}Arquivo:${colors.reset} ${result.filePath?.replace(basePath, '').replace(/\\/g, '/')}
${result.routePath ? `│ ${colors.yellow}Rota:${colors.reset}    ${result.routePath}` : ''}
${result.selectedService ? `│ ${colors.yellow}Serviço:${colors.reset}  ${result.selectedService}` : ''}
${result.selectedModels && result.selectedModels.length > 0 ? `│ ${colors.yellow}Models:${colors.reset}   ${result.selectedModels.join(', ')}` : ''}
${colors.cyan}└─────────────────────────────────────────────────────┘${colors.reset}

${colors.green}📝 Próximos passos:${colors.reset}
  1. Edite o arquivo criado
  2. ${result.routePath ? `Acesse a rota #${result.routePath}` : 'Importe e use em seus componentes'}
`);
}

module.exports = {
  interactiveMode,
  showSummary
};
