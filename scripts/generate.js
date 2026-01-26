/**
 * ===============================================
 * 🎨 GERADOR DE COMPONENTES/PÁGINAS SPFx
 * ===============================================
 * 
 * Gera automaticamente páginas, componentes, serviços e hooks
 * para projetos SharePoint SPFx.
 * 
 * Uso:
 *   pnpm run generate:page NomeDaPagina
 *   pnpm run generate:component NomeDoComponente
 *   pnpm run generate:service NomeDoServico
 *   pnpm run generate:hook useNomeDoHook
 *   pnpm run generate (modo interativo com menu)
 * 
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const templates = require('./templates');
const { log, colors } = require('./utils/logger');

const basePath = path.resolve(__dirname, '..');

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function toPascalCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
    .replace(/\s+/g, '')
    .replace(/-/g, '');
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log.success(`Diretório criado: ${dirPath}`);
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// ============================================
// GERADORES
// ============================================

async function generatePage(name, options = {}) {
  const pageName = toPascalCase(name);
  const routePath = options.route || `/${toKebabCase(name)}`;
  
  const generatedFiles = [];
  
  // Orquestração CRUD
  if (options.createCRUD) {
    log.info(`🚀 Iniciando geração da stack CRUD para ${pageName}...`);
    
    // Garantir QueryClientProvider no App.tsx
    ensureQueryClientProvider();
    
    // 1. Model
    const modelResult = await generateModel(name);
    if (modelResult) {
      generatedFiles.push({
        name: modelResult.modelName,
        path: modelResult.filePath,
        description: `Interface TypeScript com estrutura de dados para ${name}. Define as propriedades e tipos dos itens da lista SharePoint.`,
        type: 'model'
      });
    }
    
    // 2. Service (passa nome com sufixo Service e desativa validação durante geração)
    const serviceResult = await generateService(`${name}Service`, { skipValidation: true });
    if (serviceResult) {
      generatedFiles.push({
        name: serviceResult.serviceName,
        path: serviceResult.filePath,
        description: `Serviço PnP/SharePoint especializado para operações CRUD na lista de ${name}. Gerencia comunicações com a API do SharePoint.`,
        type: 'service'
      });
    }
    
    // 3. Hook
    const hookResult = await generateHook(name);
    if (hookResult) {
      generatedFiles.push({
        name: hookResult.hookName,
        path: hookResult.filePath,
        description: `React Hook customizado que encapsula a lógica de estado e operações assíncronas para ${name}. Utiliza TanStack Query para cache e otimizações.`,
        type: 'hook'
      });
    }
    
    // Configurar metadados para o template da página
    options.crudInfo = {
      listName: options.listName || name,
      modelName: `I${pageName}`,
      hookName: `use${pageName}`,
      crudMode: options.crudMode || 'read'
    };
    
    // Desativar exemplo básico se CRUD foi selecionado
    options.withSharePoint = false;
  }

  const withSharePoint = options.withSharePoint !== false;
  
  // Criar diretório se não existir
  const pagesDir = path.join(basePath, 'src', 'webparts', 'app', 'pages');
  ensureDir(pagesDir);
  
  // Caminho do arquivo
  const filePath = path.join(pagesDir, `${pageName}.tsx`);
  
  if (fileExists(filePath)) {
    log.error(`Página ${pageName} já existe!`);
    process.exit(1);
  }
  
  // Adicionar a própria página à lista de arquivos gerados
  generatedFiles.push({
    name: `${pageName} (Página)`,
    path: filePath,
    description: `Componente React principal que renderiza a interface de ${name}. Contém a estrutura visual, lógica de navegação entre seções e integração com os demais componentes.`,
    type: 'page'
  });
  
  // Passar a lista de arquivos gerados para o template
  options.generatedFiles = generatedFiles;
  
  // Criar arquivo
  fs.writeFileSync(filePath, templates.page(pageName, options));
  log.success(`Arquivo criado: src/webparts/app/pages/${pageName}.tsx`);
  
  // Adicionar rota ao App.tsx
  if (options.addRoute !== false) {
    addRouteToApp(pageName, routePath);
  }
  
  // Adicionar ao menu de navegação
  if (options.addToNav) {
    addNavigationItem(name, routePath);
  }
  
  // Criar teste
  if (options.withTest !== false) {
    const testsDir = path.join(basePath, 'tests', 'pages');
    ensureDir(testsDir);
    const testPath = path.join(testsDir, `${pageName}.test.tsx`);
    fs.writeFileSync(testPath, templates.test(pageName, 'page'));
    log.success(`Teste criado: tests/pages/${pageName}.test.tsx`);
    
    generatedFiles.push({
      name: `${pageName}.test`,
      path: testPath,
      description: `Teste unitário do componente ${pageName}. Garante o funcionamento correto da interface e das interações do usuário.`,
      type: 'test'
    });
  }
  
  return { pageName, routePath, filePath, generatedFiles };
}

async function generateComponent(name, options = {}) {
  const componentName = toPascalCase(name);
  const withProps = options.withProps !== false;
  
  // Criar diretório se não existir
  const componentsDir = path.join(basePath, 'src', 'webparts', 'app', 'components');
  ensureDir(componentsDir);
  
  // Caminho do arquivo
  const filePath = path.join(componentsDir, `${componentName}.tsx`);
  
  if (fileExists(filePath)) {
    log.error(`Componente ${componentName} já existe!`);
    process.exit(1);
  }
  
  // Criar arquivo
  fs.writeFileSync(filePath, templates.component(componentName, withProps));
  log.success(`Arquivo criado: src/webparts/app/components/${componentName}.tsx`);
  
  // Criar teste
  if (options.withTest !== false) {
    const testsDir = path.join(basePath, 'tests', 'components');
    ensureDir(testsDir);
    const testPath = path.join(testsDir, `${componentName}.test.tsx`);
    fs.writeFileSync(testPath, templates.test(componentName, 'component'));
    log.success(`Teste criado: tests/components/${componentName}.test.tsx`);
  }
  
  return { componentName, filePath };
}

async function generateService(name, options = {}) {
  const serviceName = toPascalCase(name);
  
  // Criar diretório se não existir
  const servicesDir = path.join(basePath, 'src', 'core', 'services');
  ensureDir(servicesDir);
  
  // Caminho do arquivo
  const filePath = path.join(servicesDir, `${serviceName}.ts`);
  
  if (fileExists(filePath)) {
    log.error(`Serviço ${serviceName} já existe!`);
    process.exit(1);
  }
  
  // Criar arquivo
  fs.writeFileSync(filePath, templates.service(serviceName));
  log.success(`Arquivo criado: src/core/services/${serviceName}.ts`);
  
  // Criar teste
  if (options.withTest !== false) {
    const testsDir = path.join(basePath, 'tests', 'services');
    ensureDir(testsDir);
    const testPath = path.join(testsDir, `${serviceName}.test.ts`);
    fs.writeFileSync(testPath, templates.test(serviceName, 'service'));
    log.success(`Teste criado: tests/services/${serviceName}.test.ts`);
  }
  
  return { serviceName, filePath };
}

async function generateHook(name, options = {}) {
  let hookName = name;
  if (!hookName.startsWith('use')) {
    hookName = 'use' + toPascalCase(hookName);
  } else {
    hookName = 'use' + toPascalCase(hookName.replace(/^use/i, ''));
  }
  
  // Criar diretório se não existir
  const hooksDir = path.join(basePath, 'src', 'core', 'hooks');
  ensureDir(hooksDir);
  
  // Caminho do arquivo
  const filePath = path.join(hooksDir, `${hookName}.ts`);
  
  if (fileExists(filePath)) {
    log.error(`Hook ${hookName} já existe!`);
    process.exit(1);
  }
  
  // Criar arquivo
  fs.writeFileSync(filePath, templates.hook(hookName));
  log.success(`Arquivo criado: src/core/hooks/${hookName}.ts`);
  
  // Criar teste
  if (options.withTest !== false) {
    const testsDir = path.join(basePath, 'tests', 'hooks');
    ensureDir(testsDir);
    const testPath = path.join(testsDir, `${hookName}.test.ts`);
    fs.writeFileSync(testPath, templates.test(hookName, 'hook'));
    log.success(`Teste criado: tests/hooks/${hookName}.test.ts`);
  }
  
  return { hookName, filePath };
}

async function generateModel(name, options = {}) {
  const modelName = 'I' + toPascalCase(name);
  
  // Criar diretório se não existir
  const modelsDir = path.join(basePath, 'src', 'models');
  ensureDir(modelsDir);
  
  // Caminho do arquivo
  const filePath = path.join(modelsDir, `${modelName}.ts`);
  
  if (fileExists(filePath)) {
    log.error(`Model ${modelName} já existe!`);
    return false;
  }
  
  // Criar arquivo
  fs.writeFileSync(filePath, templates.model(modelName));
  log.success(`Arquivo criado: src/models/${modelName}.ts`);
  
  return { modelName, filePath };
}

// ============================================
// GARANTIR QUERYCLIENTPROVIDER NO APP.TSX
// ============================================

function ensureQueryClientProvider() {
  const appPath = path.join(basePath, 'src', 'webparts', 'app', 'App.tsx');
  
  if (!fileExists(appPath)) {
    log.warn('App.tsx não encontrado. QueryClientProvider não adicionado.');
    return;
  }
  
  let content = fs.readFileSync(appPath, 'utf8');
  
  // Verifica se já tem QueryClientProvider
  if (content.includes('QueryClientProvider')) {
    log.info('QueryClientProvider já configurado no App.tsx.');
    return;
  }
  
  // Adiciona import do TanStack Query
  const hasTanStackImport = content.includes('@tanstack/react-query');
  if (!hasTanStackImport) {
    const firstImportRegex = /^import .+? from '.*?';$/m;
    const firstImport = content.match(firstImportRegex);
    if (firstImport) {
      content = content.replace(firstImportRegex, `${firstImport[0]}\nimport { QueryClient, QueryClientProvider } from '@tanstack/react-query';`);
    } else {
      log.warn('Não foi possível adicionar import do QueryClient automaticamente.');
      return;
    }
  }
  
  // Adiciona QueryClient antes do sp initialization
  const spInitRegex = /(const sp = React\.useMemo\(\) => \{)/;
  if (spInitRegex.test(content)) {
    content = content.replace(spInitRegex, `const queryClient = React.useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }), []);\n\n  $1`);
  } else {
    log.warn('Não foi possível adicionar QueryClient automaticamente.');
    return;
  }
  
  // Envolve o componente principal com QueryClientProvider
  const themeProviderStart = '<FluentProvider theme={webLightTheme}>';
  const themeProviderEnd = '</FluentProvider>';
  
  if (content.includes(themeProviderStart) && content.includes(themeProviderEnd)) {
    content = content.replace(
      `<${themeProviderStart}>\n      <SharePointContext.Provider value={sp}>`,
      `<QueryClientProvider client={queryClient}>\n      <FluentProvider theme={webLightTheme}>\n        <SharePointContext.Provider value={sp}>`
    );
    content = content.replace(
      `</SharePointContext.Provider>\n      </FluentProvider>`,
      `</SharePointContext.Provider>\n        </FluentProvider>\n    </QueryClientProvider>`
    );
  } else {
    log.warn('Não foi possível envolver componentes com QueryClientProvider.');
    return;
  }
  
  fs.writeFileSync(appPath, content);
  log.success('QueryClientProvider adicionado ao App.tsx.');
}

// ============================================
// ATUALIZAR APP.TSX COM ROTAS
// ============================================

function addRouteToApp(pageName, routePath) {
  const appPath = path.join(basePath, 'src', 'webparts', 'app', 'App.tsx');
  
  if (!fileExists(appPath)) {
    log.warn('App.tsx não encontrado. Rota não adicionada automaticamente.');
    return;
  }
  
  let content = fs.readFileSync(appPath, 'utf8');
  const importMarker = '/* GENERATOR: IMPORT_PAGE */';
  const routeMarker = '{/* GENERATOR: ROUTE_PAGE */}';
  
  // 1. Adicionar Import
  const importStatement = `import ${pageName} from './pages/${pageName}';`;
  
  if (content.includes(importMarker)) {
    content = content.replace(importMarker, `${importStatement}\n${importMarker}`);
  } else {
    // Fallback: Tenta adicionar após o último import (modo legado)
    const importRegex = /import.*from ['"]\.\/pages\/.*['"];?/g;
    const imports = content.match(importRegex);
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const insertPosition = content.lastIndexOf(lastImport) + lastImport.length;
      content = content.slice(0, insertPosition) + '\n' + importStatement + content.slice(insertPosition);
    } else {
      log.warn(`Marcador '${importMarker}' não encontrado. Import adicionado de forma genérica.`);
      const lastImportIndex = content.lastIndexOf('import');
      const nextLineIndex = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, nextLineIndex + 1) + importStatement + '\n' + content.slice(nextLineIndex + 1);
    }
  }
  
  // 2. Adicionar Rota
  const routeStatement = `<Route path="${routePath}" element={<${pageName} />} />`;
  
  if (content.includes(routeMarker)) {
    content = content.replace(routeMarker, `${routeStatement}\n                ${routeMarker}`);
  } else {
    // Fallback: Tenta adicionar antes do NotFound
    const notFoundIndex = content.indexOf('<Route path="*"');
    if (notFoundIndex !== -1) {
      log.warn(`Marcador '${routeMarker}' não encontrado. Rota adicionada antes do NotFound.`);
      content = content.slice(0, notFoundIndex) + routeStatement + '\n          ' + content.slice(notFoundIndex);
    } else {
      log.error('Não foi possível adicionar a rota automaticamente. Adicione manualmente ao App.tsx');
      return;
    }
  }
  
  fs.writeFileSync(appPath, content);
  log.success(`Rota adicionada ao App.tsx: ${routePath}`);
}

// ============================================
// ADICIONAR ITEM AO MENU DE NAVEGAÇÃO
// ============================================

function addNavigationItem(name, routePath) {
  const navPath = path.join(basePath, 'src', 'webparts', 'app', 'config', 'navigation.ts');
  
  if (!fileExists(navPath)) {
    log.warn('navigation.ts não encontrado. Item de menu não adicionado.');
    return;
  }
  
  let content = fs.readFileSync(navPath, 'utf8');
  const iconMarker = '/* GENERATOR: IMPORT_ICON */';
  const itemMarker = '/* GENERATOR: NAV_ITEM */';
  
  // Verificar se já existe
  if (content.includes(`path: '${routePath}'`)) {
    log.warn('Rota já existe na navegação.');
    return;
  }

  // 1. Garantir import do ícone
  // Tenta usar o marcador primeiro
  if (!content.includes('FileText')) {
    if (content.includes(iconMarker)) {
       // Se o ícone FileText não estiver importado, importamos ele de uma nova linha ou editamos o existente?
       // Por simplicidade e segurança, vamos editar o import existente se possível
       if (content.includes("from 'lucide-react'")) {
         content = content.replace(/import { (.*?) } from 'lucide-react';/, (match, p1) => {
           return `import { ${p1}, FileText } from 'lucide-react';`;
         });
       } else {
         content = content.replace(iconMarker, `import { FileText } from 'lucide-react';\n${iconMarker}`);
       }
    } else {
      // Fallback regex antigo
      content = content.replace(/import { (.*?) } from 'lucide-react';/, (match, p1) => {
        return `import { ${p1}, FileText } from 'lucide-react';`;
      });
    }
  }

  // 2. Adicionar o item ao array
  const newItem = `
  {
    title: '${name}',
    path: '${routePath}',
    icon: FileText
  },`;

  if (content.includes(itemMarker)) {
    content = content.replace(itemMarker, `${newItem}\n  ${itemMarker}`);
    fs.writeFileSync(navPath, content);
    log.success(`Item adicionado ao menu: ${name}`);
  } else {
    // Fallback antigo
    const lastBracketIndex = content.lastIndexOf('];');
    if (lastBracketIndex !== -1) {
      log.warn(`Marcador '${itemMarker}' não encontrado. Item adicionado ao final do array.`);
      content = content.slice(0, lastBracketIndex) + newItem + '\n' + content.slice(lastBracketIndex);
      fs.writeFileSync(navPath, content);
      log.success(`Item adicionado ao menu: ${name}`);
    } else {
      log.error('Não foi possível encontrar o array de navegação em navigation.ts');
    }
  }
}

// ============================================
// MODO INTERATIVO (PROMPTS)
// ============================================

async function interactiveMode() {
  log.title('🎨 GERADOR INTERATIVO SPFx');
  
  // 1. Ler modo do projeto do .env
  let projectMode = 'page'; // default
  try {
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
  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: `Qual o nome do(a) ${artifactType}?`,
    validate: value => value.length < 2 ? 'Nome muito curto' : true
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
      },
      {
        type: 'confirm',
        name: 'connectToList',
        message: 'Deseja conectar essa página a uma lista SharePoint?',
        initial: false
      }
    ]);

    // Se optou por conectar à lista, perguntas adicionais
    if (pageOptions.connectToList) {
      const listOptions = await prompts([
        {
          type: 'text',
          name: 'listName',
          message: 'Qual o nome da lista no SharePoint?',
          initial: name,
          validate: value => value.length < 2 ? 'Nome muito curto' : true
        },
        {
          type: 'select',
          name: 'crudType',
          message: 'Qual o nível de integração desejado?',
          choices: [
            { title: 'Apenas Leitura (Tabela)', value: 'read' },
            { title: 'CRUD Completo (Tabela + Formulários)', value: 'crud' }
          ]
        }
      ]);

      Object.assign(pageOptions, listOptions);
      pageOptions.createCRUD = true;
      pageOptions.crudMode = pageOptions.crudType;
      pageOptions.withSharePoint = false;
    } else {
      const sharePointExample = await prompts([
        {
          type: 'confirm',
          name: 'withSharePoint',
          message: 'Incluir código de exemplo do SharePoint?',
          initial: true
        }
      ]);

      Object.assign(pageOptions, sharePointExample);
    }

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

  // Executar Geração
  let result;
  switch (artifactType) {
    case 'page':
      result = await generatePage(name, options);
      if (result) showSummary('Página', result);
      break;
    case 'component':
      result = await generateComponent(name, options);
      if (result) showSummary('Componente', result);
      break;
    case 'service':
      result = await generateService(name);
      if (result) showSummary('Serviço', result);
      break;
    case 'hook':
      result = await generateHook(name);
      if (result) showSummary('Hook', result);
      break;
    case 'model':
      result = await generateModel(name);
      if (result) showSummary('Model', result);
      break;
  }
}

// ============================================
// MOSTRAR RESUMO
// ============================================

function showSummary(type, result) {
  console.log(`
${colors.cyan}┌─────────────────────────────────────────────────────┐
│           ✨ ${type} criado com sucesso!${' '.repeat(Math.max(0, 16 - type.length))}│
├─────────────────────────────────────────────────────┤${colors.reset}
│ ${colors.yellow}Arquivo:${colors.reset} ${result.filePath?.replace(basePath, '').replace(/\\/g, '/')}
${result.routePath ? `│ ${colors.yellow}Rota:${colors.reset}    ${result.routePath}` : ''}
${colors.cyan}└─────────────────────────────────────────────────────┘${colors.reset}

${colors.green}📝 Próximos passos:${colors.reset}
  1. Edite o arquivo criado
  2. ${result.routePath ? `Acesse a rota #${result.routePath}` : 'Importe e use em seus componentes'}
`);
}

// ============================================
// MAIN
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const name = args[1];
  
  if (!command) {
    await interactiveMode();
    return;
  }
  
  // Suporte a modo legacy (argumentos via CLI)
  if (!name) {
    log.error('Nome é obrigatório no modo CLI!');
    log.info('Uso: pnpm run generate:page NomeDaPagina');
    process.exit(1);
  }
  
  let result;
  
  switch (command) {
    case 'page':
      result = await generatePage(name);
      if (result) showSummary('Página', result);
      break;
      
    case 'component':
      result = await generateComponent(name);
      if (result) showSummary('Componente', result);
      break;
      
    case 'service':
      result = await generateService(name);
      if (result) showSummary('Serviço', result);
      break;
      
    case 'hook':
      result = await generateHook(name);
      if (result) showSummary('Hook', result);
      break;
      
    case 'model':
      result = await generateModel(name);
      if (result) showSummary('Model', result);
      break;
      
    default:
      log.error(`Comando desconhecido: ${command}`);
      log.info('Use "pnpm run generate" para o modo interativo.');
      process.exit(1);
  }
}

module.exports = {
  generatePage,
  generateComponent,
  generateService,
  generateHook,
  generateModel
};

if (require.main === module) {
  main().catch((error) => {
    log.error(`Erro: ${error.message}`);
    process.exit(1);
  });
}
