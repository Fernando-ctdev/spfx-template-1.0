/**
 * ===============================================
 * 🔧 SCRIPT DE CONFIGURAÇÃO DO PROJETO SPFx
 * ===============================================
 * 
 * Este script lê o arquivo app.config.json e atualiza
 * automaticamente todos os arquivos de configuração.
 * 
 * O que ele faz:
 * ✅ Gera GUIDs únicos na primeira execução (.guids.json)
 * ✅ Atualiza package-solution.json
 * ✅ Atualiza fast-serve/config.json
 * ✅ Atualiza config/serve.json
 * ✅ Atualiza AppWebPart.manifest.json
 * ✅ Configura modo fullpage ou webpart
 * 
 * Execute: npm run configure (ou automático após npm install)
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Gera um GUID válido
function generateGuid() {
  return crypto.randomUUID().toUpperCase();
}

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✔${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✖${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.cyan}${'='.repeat(50)}\n${msg}\n${'='.repeat(50)}${colors.reset}\n`)
};

// Caminho base do projeto
const basePath = path.resolve(__dirname, '..');

// Arquivo para armazenar GUIDs gerados (não precisa editar)
const guidsFile = path.join(basePath, '.guids.json');

// Ler ou gerar GUIDs
function getGuids() {
  if (fs.existsSync(guidsFile)) {
    return JSON.parse(fs.readFileSync(guidsFile, 'utf8'));
  }
  
  // Gerar novos GUIDs na primeira execução
  const guids = {
    appId: generateGuid(),
    webPartId: generateGuid(),
    featureId: generateGuid()
  };
  
  fs.writeFileSync(guidsFile, JSON.stringify(guids, null, 2));
  log.success('GUIDs gerados automaticamente!');
  
  return guids;
}

// Ler configuração principal
function readConfig() {
  const configPath = path.join(basePath, 'app.config.json');
  
  if (!fs.existsSync(configPath)) {
    log.error('app.config.json não encontrado!');
    log.info('O arquivo app.config.json deve existir na raiz do projeto.');
    process.exit(1);
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // Validar e definir modo padrão se não especificado
  if (!config.mode) {
    config.mode = 'page';
    log.warn('Modo não especificado. Usando "page" como padrão.');
  }
  
  // Validar modo
  const validModes = ['page', 'component'];
  if (!validModes.includes(config.mode)) {
    log.error(`Modo inválido: "${config.mode}". Use "page" ou "component".`);
    process.exit(1);
  }
  
  return config;
}

// Escrever arquivo JSON formatado
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

// Atualizar package-solution.json
function updatePackageSolution(config, guids) {
  const filePath = path.join(basePath, 'config', 'package-solution.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  data.solution.name = config.appName;
  data.solution.id = guids.appId;
  data.solution.features[0].id = guids.featureId;
  data.paths.zippedPackage = `solution/${config.appName}.sppkg`;
  
  writeJson(filePath, data);
  log.success('config/package-solution.json');
}

// Atualizar fast-serve/config.json
function updateFastServe(config) {
  const filePath = path.join(basePath, 'fast-serve', 'config.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const fullUrl = `https://${config.tenant}.sharepoint.com${config.siteUrl}`;
  const debugUrl = `${fullUrl}?debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/manifests.js`;
  
  data.serveConfigurations.serve.openUrl = debugUrl;
  
  writeJson(filePath, data);
  log.success('fast-serve/config.json');
}

// Atualizar config/serve.json
function updateServe(config) {
  const filePath = path.join(basePath, 'config', 'serve.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const fullUrl = `https://${config.tenant}.sharepoint.com`;
  
  data.initialPage = `${fullUrl}/_layouts/workbench.aspx`;
  
  writeJson(filePath, data);
  log.success('config/serve.json');
}

// Atualizar AppWebPart.manifest.json
function updateManifest(config, guids) {
  const filePath = path.join(basePath, 'src', 'webparts', 'app', 'AppWebPart.manifest.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  data.id = guids.webPartId;
  data.preconfiguredEntries[0].title.default = config.appTitle;
  data.preconfiguredEntries[0].description.default = config.appTitle;
  
  writeJson(filePath, data);
  log.success('src/webparts/app/AppWebPart.manifest.json');
}

// Configurar modo da aplicação (page ou component)
function configureAppMode(config) {
  const appWebPartPath = path.join(basePath, 'src', 'webparts', 'app', 'AppWebPart.ts');
  let content = fs.readFileSync(appWebPartPath, 'utf8');
  
  const fullPageImport = "import './shared/css/page-layout.css';";
  const hasFullPageImport = content.includes(fullPageImport);
  
  if (config.mode === 'page') {
    // Modo Page - adicionar import do CSS se não existir
    if (!hasFullPageImport) {
      // Adicionar após o import do global.module.scss
      content = content.replace(
        "import './shared/css/global.module.scss';",
        "import './shared/css/global.module.scss';\nimport './shared/css/page-layout.css';"
      );
      fs.writeFileSync(appWebPartPath, content);
      log.success('Modo Página ativado - CSS do SharePoint será ocultado');
    }
  } else if (config.mode === 'component') {
    // Modo Component - remover import do CSS se existir
    if (hasFullPageImport) {
      content = content.replace(`\n${fullPageImport}`, '');
      content = content.replace(fullPageImport, '');
      fs.writeFileSync(appWebPartPath, content);
      log.success('Modo Componente ativado - Elementos do SharePoint visíveis');
    }
  }
}

// Exibir resumo da configuração
function showSummary(config) {
  const fullUrl = `https://${config.tenant}.sharepoint.com${config.siteUrl}`;
  const modeText = config.mode === 'page' ? 'Página (Full Viewport)' : 'Componente (WebPart)';
  const modeIcon = config.mode === 'page' ? '🖥️' : '🧩';
  
  console.log(`
${colors.cyan}┌─────────────────────────────────────────────────────┐
│              📋 CONFIGURAÇÃO APLICADA               │
├─────────────────────────────────────────────────────┤${colors.reset}
│ ${colors.yellow}Site:${colors.reset}  ${fullUrl}
│ ${colors.yellow}App:${colors.reset}   ${config.appTitle} (${config.appName})
│ ${colors.yellow}Modo:${colors.reset}  ${modeIcon} ${modeText}
${colors.cyan}└─────────────────────────────────────────────────────┘${colors.reset}
`);
}



// Função principal
function main() {
  log.title('🔧 CONFIGURANDO PROJETO SPFx');
  
  const config = readConfig();
  const guids = getGuids();
  
  log.info('Atualizando arquivos...\n');
  
  try {
    updatePackageSolution(config, guids);
    updateFastServe(config);
    updateServe(config);
    updateManifest(config, guids);
    configureAppMode(config);
    
    showSummary(config);
    
    console.log('');
    log.success('🎉 Configuração concluída!');
    log.info('Próximos passos:');
    console.log('   1. npm run serve\n');
    
  } catch (error) {
    log.error(`Erro: ${error.message}`);
    process.exit(1);
  }
}

main();
