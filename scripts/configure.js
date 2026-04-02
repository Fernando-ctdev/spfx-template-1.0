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
const {
  registerInterruptHandler,
  finalize,
  createFileWithTracking,
  trackCreatedFile,
  trackCreatedDir,
  modifyFileWithBackup
} = require('./utils/interrupt-handler');

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
  return crypto.randomUUID().toLowerCase();
}

// Ler ou gerar GUIDs
function getGuids() {
  const guidsFile = path.join(basePath, '.guids.json');
  if (fs.existsSync(guidsFile)) {
    try {
      const savedGuids = JSON.parse(fs.readFileSync(guidsFile, 'utf8'));
      const normalizedGuids = {
        ...savedGuids,
        appId: (savedGuids.appId || '').toLowerCase(),
        webPartId: (savedGuids.webPartId || '').toLowerCase(),
        featureId: (savedGuids.featureId || '').toLowerCase(),
        extensionId: (savedGuids.extensionId || '').toLowerCase()
      };

      if (!savedGuids.extensionId) {
        normalizedGuids.extensionId = generateGuid();
      }

      if (JSON.stringify(savedGuids) !== JSON.stringify(normalizedGuids)) {
        fs.writeFileSync(guidsFile, JSON.stringify(normalizedGuids, null, 2));
      }

      return normalizedGuids;
    } catch (e) {
      log.warn('Arquivo .guids.json corrompido. Gerando novos GUIDs.');
    }
  }
  
  const guids = {
    appId: generateGuid(),
    webPartId: generateGuid(),
    featureId: generateGuid(),
    extensionId: generateGuid()
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

function toBoolean(value, fallback = false) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }

  return fallback;
}

function normalizeHideScope(value) {
  return value === 'specific-page' ? 'specific-page' : 'sitepages';
}

function parseHideLevels(value) {
  if (!value || typeof value !== 'string') {
    return [];
  }

  return value
    .split(',')
    .map(level => level.trim())
    .filter(Boolean);
}

function normalizeLayout(value, fallback = 'blank') {
  return value === 'navbar' || value === 'sidebar' || value === 'blank' ? value : fallback;
}

function normalizeNavigationScope(value) {
  return value === 'spa-and-sitepages' ? 'spa-and-sitepages' : 'spa-only';
}

function normalizeHideConfig(answers) {
  const layout = normalizeLayout(answers.layout, answers.mode === 'page' ? 'navbar' : 'blank');
  const hideNativeUI = answers.mode === 'page' && toBoolean(answers.hideNativeUI, false);
  const hideScope = hideNativeUI ? normalizeHideScope(answers.hideScope) : 'sitepages';
  const hideTargetPageSlug = hideNativeUI && hideScope === 'specific-page'
    ? (answers.hideTargetPageSlug || '').trim().toLowerCase()
    : '';

  const hideLevels = hideNativeUI
    ? (Array.isArray(answers.hideLevels) ? answers.hideLevels : []).filter(Boolean)
    : [];

  const navigationScope = answers.mode === 'page' && layout !== 'blank'
    ? normalizeNavigationScope(answers.navigationScope)
    : 'spa-only';

  const navigationMount = answers.mode === 'page' && layout !== 'blank' && navigationScope === 'spa-and-sitepages'
    ? 'app-customizer'
    : 'layout';

  const resolvedLayout = navigationMount === 'app-customizer' ? 'blank' : layout;

  return {
    ...answers,
    layout,
    resolvedLayout,
    navigationScope,
    navigationMount,
    navigationShell: layout,
    hideNativeUI,
    hideScope,
    hideTargetPageSlug,
    hideLevels
  };
}

function writeHideUiConfig(answers) {
  const extensionConfigPath = path.join(basePath, 'src', 'extensions', 'appCustomizer', 'hideUiConfig.ts');
  const hideLevelsSet = new Set(answers.hideLevels || []);

  const configContent = `export type HideScope = 'sitepages' | 'specific-page';
export type NavigationScope = 'spa-only' | 'spa-and-sitepages';
export type NavigationMount = 'layout' | 'app-customizer';
export type NavigationShell = 'navbar' | 'sidebar' | 'blank';

export interface IHideUiConfig {
  enabled: boolean;
  scope: HideScope;
  targetPageSlug: string;
  navigationScope: NavigationScope;
  navigationMount: NavigationMount;
  shellLayout: NavigationShell;
  hideLevels: {
    base: boolean;
    commandBar: boolean;
    socialBar: boolean;
    comments: boolean;
  };
}

export const hideUiConfig: IHideUiConfig = {
  enabled: ${answers.hideNativeUI},
  scope: '${answers.hideScope}',
  targetPageSlug: '${answers.hideTargetPageSlug}',
  navigationScope: '${answers.navigationScope}',
  navigationMount: '${answers.navigationMount}',
  shellLayout: '${answers.navigationShell}',
  hideLevels: {
    base: ${hideLevelsSet.has('base')},
    commandBar: ${hideLevelsSet.has('commandBar')},
    socialBar: ${hideLevelsSet.has('socialBar')},
    comments: ${hideLevelsSet.has('comments')}
  }
};
`;

  if (fs.existsSync(extensionConfigPath)) {
    modifyFileWithBackup(extensionConfigPath, configContent);
  } else {
    fs.writeFileSync(extensionConfigPath, configContent);
    trackCreatedFile(extensionConfigPath);
    log.success('Arquivo de configuração da extension criado com sucesso!');
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

  if (process.env.SPFX_NON_INTERACTIVE === 'true') {
    const mode = currentEnv.SPFX_MODE === 'component' ? 'component' : 'page';
    const layout = normalizeLayout(currentEnv.SPFX_LAYOUT, mode === 'page' ? 'navbar' : 'blank');
    const hideNativeUI = mode === 'page' ? toBoolean(currentEnv.SPFX_HIDE_NATIVE_UI, false) : false;
    const hideScope = hideNativeUI ? normalizeHideScope(currentEnv.SPFX_HIDE_SCOPE) : 'sitepages';
    const hideTargetPageSlug = hideNativeUI && hideScope === 'specific-page'
      ? (currentEnv.SPFX_HIDE_TARGET_PAGE_SLUG || '').trim().toLowerCase()
      : '';

    return normalizeHideConfig({
      tenant: currentEnv.SPFX_TENANT || '',
      siteUrl: currentEnv.SPFX_SITE_URL || '/sites/dev',
      appName: (currentEnv.SPFX_APP_NAME || 'minha-app').toLowerCase().replace(/\s+/g, '-'),
      appTitle: currentEnv.SPFX_APP_TITLE || 'Minha Aplicação',
      mode,
      layout,
      navigationScope: normalizeNavigationScope(currentEnv.SPFX_NAVIGATION_SCOPE),
      hideNativeUI,
      hideScope,
      hideTargetPageSlug,
      hideLevels: parseHideLevels(currentEnv.SPFX_HIDE_LEVELS)
    });
  }

  const currentLayout = normalizeLayout(currentEnv.SPFX_LAYOUT, 'navbar');
  const currentNavigationScope = normalizeNavigationScope(currentEnv.SPFX_NAVIGATION_SCOPE);

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
      initial: currentLayout === 'sidebar' ? 1 : currentLayout === 'blank' ? 2 : 0
    },
    {
      type: (prev, values) => values.mode === 'page' && values.layout !== 'blank' ? 'select' : null,
      name: 'navigationScope',
      message: 'Como será a navegação?',
      choices: [
        { title: 'Somente interna da SPA', value: 'spa-only' },
        { title: 'Interna da SPA + outras SitePages do mesmo site', value: 'spa-and-sitepages' }
      ],
      initial: currentNavigationScope === 'spa-and-sitepages' ? 1 : 0
    },
    {
      type: (prev, values) => values.mode === 'page' ? 'confirm' : null,
      name: 'hideNativeUI',
      message: 'Deseja ocultar elementos nativos do SharePoint?',
      initial: toBoolean(currentEnv.SPFX_HIDE_NATIVE_UI, false)
    },
    {
      type: (prev, values) => values.mode === 'page' && values.hideNativeUI ? 'select' : null,
      name: 'hideScope',
      message: 'Onde aplicar a ocultação?',
      choices: [
        { title: 'Todas as páginas em /SitePages/', value: 'sitepages' },
        { title: 'Apenas uma página específica', value: 'specific-page' }
      ],
      initial: normalizeHideScope(currentEnv.SPFX_HIDE_SCOPE) === 'specific-page' ? 1 : 0
    },
    {
      type: (prev, values) => values.mode === 'page' && values.hideNativeUI && values.hideScope === 'specific-page' ? 'text' : null,
      name: 'hideTargetPageSlug',
      message: 'Qual slug da página? (ex: portal.aspx)',
      initial: currentEnv.SPFX_HIDE_TARGET_PAGE_SLUG || 'portal.aspx',
      format: val => val.trim().toLowerCase(),
      validate: value => value.endsWith('.aspx') ? true : 'Informe um slug válido terminando com .aspx'
    },
    {
      type: (prev, values) => values.mode === 'page' && values.hideNativeUI ? 'multiselect' : null,
      name: 'hideLevels',
      message: 'Selecione os níveis de ocultação desejados',
      choices: [
        {
          title: 'Cabeçalho/Navegação nativa (suite nav, app bar, header, footer)',
          value: 'base',
          selected: parseHideLevels(currentEnv.SPFX_HIDE_LEVELS).includes('base')
        },
        {
          title: 'Command bar (Editar, Novo, etc)',
          value: 'commandBar',
          selected: parseHideLevels(currentEnv.SPFX_HIDE_LEVELS).includes('commandBar')
        },
        {
          title: 'Barra social',
          value: 'socialBar',
          selected: parseHideLevels(currentEnv.SPFX_HIDE_LEVELS).includes('socialBar')
        },
        {
          title: 'Comentários',
          value: 'comments',
          selected: parseHideLevels(currentEnv.SPFX_HIDE_LEVELS).includes('comments')
        }
      ],
      hint: '- Espaço para marcar/desmarcar. Enter para confirmar.'
    }
  ];

  const response = await prompts(questions);
  
  // Normalizar resposta do layout se foi pulada
  if (!response.layout && response.mode === 'component') {
    response.layout = 'blank';
  }

  const normalizedResponse = normalizeHideConfig(response);
  
  if (!response.tenant) {
    log.error('Configuração cancelada pelo usuário.');
    process.exit(0);
  }

  return normalizedResponse;
}

function generateEnvFile(answers) {
  const envContent = templates.env(answers);
  const envPath = path.join(basePath, '.env');
  fs.writeFileSync(envPath, envContent);
  trackCreatedFile(envPath);
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

    serve.serveConfigurations = serve.serveConfigurations || {};
    serve.serveConfigurations.default = serve.serveConfigurations.default || {};
    serve.serveConfigurations.default.pageUrl = `https://${answers.tenant}.sharepoint.com/_layouts/workbench.aspx`;
    serve.serveConfigurations.default.customActions = {
      [guids.extensionId]: {
        location: 'ClientSideExtension.ApplicationCustomizer',
        properties: {}
      }
    };

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

  // 5. Application Customizer Manifest
  const extensionManifestPath = path.join(basePath, 'src', 'extensions', 'appCustomizer', 'ApplicationCustomizer.manifest.json');
  if (fs.existsSync(extensionManifestPath)) {
    const extensionManifest = readJson(extensionManifestPath);
    extensionManifest.id = guids.extensionId;
    writeJson(extensionManifestPath, extensionManifest);
  }

  // 6. elements.xml (CustomAction)
  const elementsPath = path.join(basePath, 'sharepoint', 'assets', 'elements.xml');
  if (fs.existsSync(elementsPath)) {
    const elementsXml = fs.readFileSync(elementsPath, 'utf8');
    const updatedXml = elementsXml.replace(
      /ClientSideComponentId="[^"]+"/,
      `ClientSideComponentId="${guids.extensionId}"`
    );
    fs.writeFileSync(elementsPath, updatedXml);
  }
}

function configureAppMode(answers) {
  const appWebPartPath = path.join(basePath, 'src', 'webparts', 'app', 'AppWebPart.ts');

  if (!fs.existsSync(appWebPartPath)) {
    log.error('AppWebPart.ts não encontrado!');
    return;
  }

  let content = fs.readFileSync(appWebPartPath, 'utf8');
  const importMarker = '/* CONFIGURE: IMPORT_CSS */';

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

  modifyFileWithBackup(appWebPartPath, content);
  log.success(`Modo ${answers.mode.toUpperCase()} configurado.`);
}

function configureLayout(answers) {
  const layoutPath = path.join(basePath, 'src', 'webparts', 'app', 'components', 'Layout.tsx');
  const selectedLayout = answers.resolvedLayout || answers.layout;

  // Selecionar template
  const layoutContent = templates[selectedLayout] || templates.blank;

  modifyFileWithBackup(layoutPath, layoutContent.trim());
  log.success(`Layout ${selectedLayout.toUpperCase()} aplicado.`);
}

async function configureWidgetStructure(answers) {
  log.info('Ajustando estrutura para modo Widget...');

  // 1. Substituir App.tsx
  const appWidgetTemplate = require('./templates/app-widget');
  const appPath = path.join(basePath, 'src', 'webparts', 'app', 'App.tsx');
  modifyFileWithBackup(appPath, appWidgetTemplate.trim());
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
    trackCreatedDir(componentsDir);
  }

  fs.writeFileSync(newWidgetPath, widgetTemplate.trim());
  trackCreatedFile(newWidgetPath);
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
  // Registrar handler de SIGINT
  registerInterruptHandler();

  log.title('WIZARD DE CONFIGURAÇÃO DO PROJETO');

  try {
    const answers = await askQuestions();
    const guids = getGuids();

    console.log('\nAplicando configurações...\n');

    generateEnvFile(answers);
    writeHideUiConfig(answers);
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

    // Finalizar handler
    finalize();

  } catch (error) {
    log.error('Erro durante a configuração: ' + error.message);
    console.error(error);
    finalize();
  }
}

main();
