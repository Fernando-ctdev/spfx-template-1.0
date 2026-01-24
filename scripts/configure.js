/**
 * ===============================================
 * 🔧 WIZARD DE CONFIGURAÇÃO INTERATIVA SPFx
 * ===============================================
 * 
 * Este script guia o desenvolvedor na configuração inicial do projeto.
 * 
 * Fluxo:
 * 1. Coleta informações via perguntas interativas (CLI)
 * 2. Gera o arquivo .env com as respostas
 * 3. Configura GUIDs, manifestos e arquivos JSON
 * 4. Ajusta o código fonte (Modo e Layout)
 * 
 * Execute: pnpm run configure
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const crypto = require('crypto');
const { log, colors } = require('./utils/logger');

// Carregar templates
const templates = {
  navbar: require('./templates/layouts/navbar'),
  sidebar: require('./templates/layouts/sidebar'),
  blank: require('./templates/layouts/blank'),
  env: require('./templates/env')
};

// Caminho base do projeto
const basePath = path.resolve(__dirname, '..');

// Gera um GUID válido
function generateGuid() {
  return crypto.randomUUID().toUpperCase();
}

// Ler ou gerar GUIDs
function getGuids() {
  const guidsFile = path.join(basePath, '.guids.json');
  if (fs.existsSync(guidsFile)) {
    try {
      return JSON.parse(fs.readFileSync(guidsFile, 'utf8'));
    } catch (e) {
      log.warn('Arquivo .guids.json corrompido. Gerando novos GUIDs.');
    }
  }
  
  const guids = {
    appId: generateGuid(),
    webPartId: generateGuid(),
    featureId: generateGuid()
  };
  
  fs.writeFileSync(guidsFile, JSON.stringify(guids, null, 2));
  return guids;
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo não encontrado: ${filePath}`);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    throw new Error(`Erro ao ler JSON ${filePath}: ${e.message}`);
  }
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  } catch (e) {
    throw new Error(`Erro ao escrever JSON ${filePath}: ${e.message}`);
  }
}

async function askQuestions() {
  let currentEnv = {};
  
  const envPath = path.join(basePath, '.env');
  const examplePath = path.join(basePath, '.env.example');
  
  const fileToRead = fs.existsSync(envPath) ? envPath : (fs.existsSync(examplePath) ? examplePath : null);

  if (fileToRead) {
    try {
      const envContent = fs.readFileSync(fileToRead, 'utf8');
      envContent.split('\n').forEach(line => {
        if (line.trim().startsWith('#')) return;
        const [key, value] = line.split('=');
        if (key && value) currentEnv[key.trim()] = value.trim();
      });
    } catch (e) {
      log.warn('Não foi possível ler as configurações atuais do .env');
    }
  }

  const questions = [
    {
      type: 'text',
      name: 'tenant',
      message: 'Qual o nome do seu Tenant? (ex: empresa)',
      initial: currentEnv.SPFX_TENANT || '',
      validate: value => value.length < 3 ? 'O nome do tenant é muito curto' : true
    },
    {
      type: 'text',
      name: 'siteUrl',
      message: 'Qual a URL relativa do site? (ex: /sites/meu-projeto)',
      initial: currentEnv.SPFX_SITE_URL || '/sites/dev',
      validate: value => value.startsWith('/') ? true : 'Deve começar com /'
    },
    {
      type: 'text',
      name: 'appName',
      message: 'Nome técnico da App (sem espaços, ex: minha-app)',
      initial: currentEnv.SPFX_APP_NAME || 'minha-app',
      format: val => val.toLowerCase().replace(/\s+/g, '-')
    },
    {
      type: 'text',
      name: 'appTitle',
      message: 'Título de exibição da App',
      initial: currentEnv.SPFX_APP_TITLE || 'Minha Aplicação'
    },
    {
      type: 'select',
      name: 'mode',
      message: 'Qual o modo de execução?',
      choices: [
        { title: 'Página (Full Page) - Oculta menus do SharePoint', value: 'page' },
        { title: 'Componente (WebPart widget) - Mantém menus nativos', value: 'component' }
      ],
      initial: currentEnv.SPFX_MODE === 'component' ? 1 : 0
    },
    {
      type: (prev) => prev === 'component' ? null : 'select',
      name: 'layout',
      message: 'Qual estrutura de layout inicial?',
      choices: [
        { title: 'Navbar (Menu Superior)', value: 'navbar' },
        { title: 'Sidebar (Menu Lateral)', value: 'sidebar' },
        { title: 'Blank (Apenas Conteúdo)', value: 'blank' }
      ],
      initial: 0
    }
  ];

  const response = await prompts(questions);
  
  // Normalizar resposta do layout se foi pulada
  if (!response.layout && response.mode === 'component') {
    response.layout = 'blank';
  }
  
  if (!response.tenant) {
    log.error('Configuração cancelada pelo usuário.');
    process.exit(0);
  }

  return response;
}

function generateEnvFile(answers) {
  const envContent = templates.env(answers);
  fs.writeFileSync(path.join(basePath, '.env'), envContent);
  log.success('Arquivo .env gerado com sucesso!');
}

function updateConfigs(answers, guids) {
  // 1. Package Solution
  const pkgSolPath = path.join(basePath, 'config', 'package-solution.json');
  const pkgSol = readJson(pkgSolPath);
  pkgSol.solution.name = answers.appName;
  pkgSol.solution.id = guids.appId;
  if (pkgSol.solution.features && pkgSol.solution.features[0]) {
    pkgSol.solution.features[0].id = guids.featureId;
  }
  pkgSol.paths.zippedPackage = `solution/${answers.appName}.sppkg`;
  writeJson(pkgSolPath, pkgSol);

  // 2. Fast Serve
  const fastServePath = path.join(basePath, 'fast-serve', 'config.json');
  if (fs.existsSync(fastServePath)) {
    const fastServe = readJson(fastServePath);
    const fullUrl = `https://${answers.tenant}.sharepoint.com${answers.siteUrl}`;
    fastServe.serveConfigurations.serve.openUrl = `${fullUrl}?debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/manifests.js`;
    writeJson(fastServePath, fastServe);
  } else {
    log.warn('Arquivo fast-serve/config.json não encontrado. Pulando configuração do fast-serve.');
  }

  // 3. Serve JSON (Gulp padrão)
  const servePath = path.join(basePath, 'config', 'serve.json');
  if (fs.existsSync(servePath)) {
    const serve = readJson(servePath);
    serve.initialPage = `https://${answers.tenant}.sharepoint.com/_layouts/workbench.aspx`;
    writeJson(servePath, serve);
  }

  // 4. Manifest
  const manifestPath = path.join(basePath, 'src', 'webparts', 'app', 'AppWebPart.manifest.json');
  const manifest = readJson(manifestPath);
  manifest.id = guids.webPartId;
  if (manifest.preconfiguredEntries && manifest.preconfiguredEntries[0]) {
    manifest.preconfiguredEntries[0].title.default = answers.appTitle;
    manifest.preconfiguredEntries[0].description.default = answers.appTitle;
  }
  writeJson(manifestPath, manifest);
}

function configureAppMode(answers) {
  const appWebPartPath = path.join(basePath, 'src', 'webparts', 'app', 'AppWebPart.ts');
  
  if (!fs.existsSync(appWebPartPath)) {
    log.error('AppWebPart.ts não encontrado!');
    return;
  }

  let content = fs.readFileSync(appWebPartPath, 'utf8');
  const importMarker = '/* CONFIGURE: IMPORT_CSS */';
  const injectMarker = '/* CONFIGURE: INJECT_STYLES */';

  // Configuração de CSS (Page Layout)
  const pageCssImport = "import './shared/css/page-layout.css';";
  
  // Limpar import antigo se existir (para evitar duplicação ou conflito)
  // Removemos imports manuais antigos se estiverem fora do marcador
  content = content.replace(`\n${pageCssImport}`, ''); 
  content = content.replace(pageCssImport, '');

  if (content.includes(importMarker)) {
    if (answers.mode === 'page') {
      // Adicionar import se for modo Page
      content = content.replace(importMarker, `${pageCssImport}\n${importMarker}`);
    } else {
      // Se for component, apenas deixa o marcador limpo (sem o import)
      // O replace acima já removeu o import se ele existia
    }
  } else {
    log.warn(`Marcador '${importMarker}' não encontrado em AppWebPart.ts. O CSS de layout pode não ser injetado corretamente.`);
  }

  // Configuração de Injeção de Estilos (Ocultar menus do SharePoint)
  const injectCall = "this._injectGlobalStyles();";
  
  // Remove chamadas antigas para garantir estado limpo
  content = content.replace(`\n    ${injectCall}`, '');
  content = content.replace(`    ${injectCall}\n`, '');
  content = content.replace(injectCall, '');

  if (content.includes(injectMarker)) {
    if (answers.mode === 'page') {
      content = content.replace(injectMarker, `${injectCall}\n    ${injectMarker}`);
    }
  } else {
    log.warn(`Marcador '${injectMarker}' não encontrado em AppWebPart.ts. A lógica de ocultação de menus pode falhar.`);
  }

  fs.writeFileSync(appWebPartPath, content);
  log.success(`Modo ${answers.mode.toUpperCase()} configurado.`);
}

function configureLayout(answers) {
  const layoutPath = path.join(basePath, 'src', 'webparts', 'app', 'components', 'Layout.tsx');
  
  // Selecionar template
  const layoutContent = templates[answers.layout] || templates.blank;

  fs.writeFileSync(layoutPath, layoutContent.trim());
  log.success(`Layout ${answers.layout.toUpperCase()} aplicado.`);
}

async function configureWidgetStructure(answers) {
  log.info('Ajustando estrutura para modo Widget...');

  // 1. Substituir App.tsx
  const appWidgetTemplate = require('./templates/app-widget');
  const appPath = path.join(basePath, 'src', 'webparts', 'app', 'App.tsx');
  fs.writeFileSync(appPath, appWidgetTemplate.trim());
  log.success('App.tsx otimizado para Widget (sem roteamento).');

  // 2. Mover/Renomear Home.tsx -> MainWidget.tsx
  const pagesDir = path.join(basePath, 'src', 'webparts', 'app', 'pages');
  const componentsDir = path.join(basePath, 'src', 'webparts', 'app', 'components');
  
  const oldHomePath = path.join(pagesDir, 'Home.tsx');
  const newWidgetPath = path.join(componentsDir, 'MainWidget.tsx');
  const widgetTemplate = require('./templates/widget-example');

  // Sempre sobrescreve com o template limpo para garantir que não sobra lixo do dashboard
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  fs.writeFileSync(newWidgetPath, widgetTemplate.trim());
  log.success('Criado componente principal: src/webparts/app/components/MainWidget.tsx');

  // 3. Limpar pasta pages se existir Home.tsx lá
  if (fs.existsSync(oldHomePath)) {
    fs.unlinkSync(oldHomePath);
    log.info('Arquivo Home.tsx removido de pages/.');
  }

  // Tenta remover a pasta pages se estiver vazia
  if (fs.existsSync(pagesDir)) {
    try {
      const files = fs.readdirSync(pagesDir);
      if (files.length === 0) {
        fs.rmdirSync(pagesDir);
        log.info('Pasta pages/ removida (não necessária para widgets).');
      }
    } catch (e) {
      // Ignora erro se não conseguir remover pasta
    }
  }
}

// Função Principal
async function main() {
  log.title('WIZARD DE CONFIGURAÇÃO DO PROJETO');
  
  try {
    const answers = await askQuestions();
    const guids = getGuids();
    
    console.log('\nAplicando configurações...\n');
    
    generateEnvFile(answers);
    updateConfigs(answers, guids);
    configureAppMode(answers);
    configureLayout(answers);

    if (answers.mode === 'component') {
      await configureWidgetStructure(answers);
    }
    
    console.log(`
${colors.cyan}┌─────────────────────────────────────────────────────┐
│              🚀 PRONTO PARA CODAR!                  │
├─────────────────────────────────────────────────────┤${colors.reset}
│ ${colors.green}pnpm run serve${colors.reset}  Para iniciar o servidor
│ ${colors.green}pnpm run build${colors.reset}  Para gerar o pacote
${colors.cyan}└─────────────────────────────────────────────────────┘${colors.reset}
`);
    
  } catch (error) {
    log.error('Erro durante a configuração: ' + error.message);
    console.error(error);
  }
}

main();
