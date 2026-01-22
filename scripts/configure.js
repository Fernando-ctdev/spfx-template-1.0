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

// Caminho base do projeto
const basePath = path.resolve(__dirname, '..');

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✔${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✖${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.cyan}${colors.dim}===============================================${colors.reset}\n${colors.cyan}   ${msg}   ${colors.reset}\n${colors.cyan}${colors.dim}===============================================${colors.reset}\n`)
};

// Gera um GUID válido
function generateGuid() {
  return crypto.randomUUID().toUpperCase();
}

// Ler ou gerar GUIDs
function getGuids() {
  const guidsFile = path.join(basePath, '.guids.json');
  if (fs.existsSync(guidsFile)) {
    return JSON.parse(fs.readFileSync(guidsFile, 'utf8'));
  }
  
  const guids = {
    appId: generateGuid(),
    webPartId: generateGuid(),
    featureId: generateGuid()
  };
  
  fs.writeFileSync(guidsFile, JSON.stringify(guids, null, 2));
  return guids;
}


function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}


async function askQuestions() {

  let currentEnv = {};
  
  const envPath = path.join(basePath, '.env');
  const examplePath = path.join(basePath, '.env.example');
  

  const fileToRead = fs.existsSync(envPath) ? envPath : (fs.existsSync(examplePath) ? examplePath : null);

  if (fileToRead) {
    const envContent = fs.readFileSync(fileToRead, 'utf8');
    envContent.split('\n').forEach(line => {

      if (line.trim().startsWith('#')) return;
      
      const [key, value] = line.split('=');
      if (key && value) currentEnv[key.trim()] = value.trim();
    });
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
        { title: 'Componente (WebPart) - Mantém menus nativos', value: 'component' }
      ],
      initial: currentEnv.SPFX_MODE === 'component' ? 1 : 0
    },
    {
      type: 'select',
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
  
  if (!response.tenant) {
    log.error('Configuração cancelada pelo usuário.');
    process.exit(0);
  }

  return response;
}


function generateEnvFile(answers) {
  const envContent = `
# Configurações do Ambiente SPFx
# Gerado automaticamente em ${new Date().toISOString()}

SPFX_TENANT=${answers.tenant}
SPFX_SITE_URL=${answers.siteUrl}
SPFX_APP_NAME=${answers.appName}
SPFX_APP_TITLE=${answers.appTitle}
SPFX_MODE=${answers.mode}

# Configurações de Build
NODE_ENV=development
`.trim();

  fs.writeFileSync(path.join(basePath, '.env'), envContent);
  log.success('Arquivo .env gerado com sucesso!');
}


function updateConfigs(answers, guids) {

  const pkgSolPath = path.join(basePath, 'config', 'package-solution.json');
  const pkgSol = JSON.parse(fs.readFileSync(pkgSolPath, 'utf8'));
  pkgSol.solution.name = answers.appName;
  pkgSol.solution.id = guids.appId;
  pkgSol.solution.features[0].id = guids.featureId;
  pkgSol.paths.zippedPackage = `solution/${answers.appName}.sppkg`;
  writeJson(pkgSolPath, pkgSol);


  const fastServePath = path.join(basePath, 'fast-serve', 'config.json');
  const fastServe = JSON.parse(fs.readFileSync(fastServePath, 'utf8'));
  const fullUrl = `https://${answers.tenant}.sharepoint.com${answers.siteUrl}`;
  fastServe.serveConfigurations.serve.openUrl = `${fullUrl}?debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/manifests.js`;
  writeJson(fastServePath, fastServe);


  const servePath = path.join(basePath, 'config', 'serve.json');
  const serve = JSON.parse(fs.readFileSync(servePath, 'utf8'));
  serve.initialPage = `https://${answers.tenant}.sharepoint.com/_layouts/workbench.aspx`;
  writeJson(servePath, serve);


  const manifestPath = path.join(basePath, 'src', 'webparts', 'app', 'AppWebPart.manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.id = guids.webPartId;
  manifest.preconfiguredEntries[0].title.default = answers.appTitle;
  manifest.preconfiguredEntries[0].description.default = answers.appTitle;
  writeJson(manifestPath, manifest);
}


function configureAppMode(answers) {
  const appWebPartPath = path.join(basePath, 'src', 'webparts', 'app', 'AppWebPart.ts');
  let content = fs.readFileSync(appWebPartPath, 'utf8');
  

  const fullPageImport = "import './shared/css/page-layout.css';";
  const hasFullPageImport = content.includes(fullPageImport);
  
  if (answers.mode === 'page' && !hasFullPageImport) {
    content = content.replace(
      "import './shared/css/global.module.scss';",
      "import './shared/css/global.module.scss';\nimport './shared/css/page-layout.css';"
    );
  } else if (answers.mode === 'component' && hasFullPageImport) {
    content = content.replace(`\n${fullPageImport}`, '');
    content = content.replace(fullPageImport, '');
  }


  const injectCall = "this._injectGlobalStyles();";
  const commentedInjectCall = "// this._injectGlobalStyles();";

  if (answers.mode === 'page') {

    if (content.includes(commentedInjectCall)) {
      content = content.replace(commentedInjectCall, injectCall);
    }
  } else {

    if (content.includes(injectCall) && !content.includes(commentedInjectCall)) {
      content = content.replace(injectCall, commentedInjectCall);
    }
  }

  fs.writeFileSync(appWebPartPath, content);
  log.success(`Modo ${answers.mode.toUpperCase()} configurado (CSS e Scripts ajustados).`);
}


function configureLayout(answers) {
  const layoutPath = path.join(basePath, 'src', 'webparts', 'app', 'components', 'Layout.tsx');
  
  let layoutContent = '';

  if (answers.layout === 'navbar') {
    layoutContent = `
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white transition-colors duration-200 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
`;
  } else if (answers.layout === 'sidebar') {
    layoutContent = `
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white transition-colors duration-200 flex">
      <aside className="w-64 flex-shrink-0 hidden md:block h-screen sticky top-0">
        <Sidebar />
      </aside>
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
`;
  } else { // blank
    layoutContent = `
import * as React from 'react';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white transition-colors duration-200">
      <main className="w-full px-4 py-8">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
`;
  }

  fs.writeFileSync(layoutPath, layoutContent.trim());
  log.success(`Layout ${answers.layout.toUpperCase()} aplicado.`);
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
