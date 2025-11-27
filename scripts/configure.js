/**
 * ===============================================
 * 🔧 SCRIPT DE CONFIGURAÇÃO DO PROJETO SPFx
 * ===============================================
 * 
 * Este script lê o arquivo app.config.json e atualiza
 * automaticamente todos os arquivos de configuração.
 * 
 * Execute: npm run configure
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
    log.error('Arquivo app.config.json não encontrado!');
    log.info('Crie o arquivo app.config.json na raiz do projeto.');
    process.exit(1);
  }
  
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
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

// Exibir resumo da configuração
function showSummary(config) {
  const fullUrl = `https://${config.tenant}.sharepoint.com${config.siteUrl}`;
  
  console.log(`
${colors.cyan}┌─────────────────────────────────────────────────────┐
│              📋 CONFIGURAÇÃO APLICADA               │
├─────────────────────────────────────────────────────┤${colors.reset}
│ ${colors.yellow}Site:${colors.reset}  ${fullUrl}
│ ${colors.yellow}App:${colors.reset}   ${config.appTitle} (${config.appName})
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
    updateManifest(config, guids);
    
    showSummary(config);
    
    log.info('Próximos passos:');
    console.log('   1. npm install (se ainda não fez)');
    console.log('   2. npm run serve\n');
    
  } catch (error) {
    log.error(`Erro: ${error.message}`);
    process.exit(1);
  }
}

main();
