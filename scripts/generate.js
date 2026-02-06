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
 *   pnpm run generate:service NomeDoServico (apenas o nome base, sem "Service")
 *   pnpm run generate:hook NomeDoHook (o prefixo "use" será adicionado automaticamente)
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

function modelExists(modelName) {
  // Verifica se o model existe em src/models ou lib/models
  const modelsDirSrc = path.join(basePath, 'src', 'models');
  const modelsDirLib = path.join(basePath, 'lib', 'models');
  
  const modelPathSrc = path.join(modelsDirSrc, `${modelName}.ts`);
  const modelPathLib = path.join(modelsDirLib, `${modelName}.ts`);
  
  return fileExists(modelPathSrc) || fileExists(modelPathLib);
}

function getModelPath(modelName) {
  // Retorna o caminho do model se existir
  const modelsDirSrc = path.join(basePath, 'src', 'models');
  const modelsDirLib = path.join(basePath, 'lib', 'models');
  
  const modelPathSrc = path.join(modelsDirSrc, `${modelName}.ts`);
  const modelPathLib = path.join(modelsDirLib, `${modelName}.ts`);
  
  if (fileExists(modelPathSrc)) {
    return { path: modelPathSrc, relative: 'src/models' };
  }
  if (fileExists(modelPathLib)) {
    return { path: modelPathLib, relative: 'lib/models' };
  }
  return null;
}

function getAvailableModels() {
  // Retorna lista de models disponíveis
  const models = [];
  const modelsDirSrc = path.join(basePath, 'src', 'models');
  const modelsDirLib = path.join(basePath, 'lib', 'models');
  
  const scanModelsDir = (dir) => {
    if (!fileExists(dir)) return [];
    const files = fs.readdirSync(dir);
    return files
      .filter(file => file.endsWith('.ts') && file !== 'index.ts')
      .map(file => file.replace('.ts', ''));
  };
  
  models.push(...scanModelsDir(modelsDirSrc));
  models.push(...scanModelsDir(modelsDirLib));
  
  return [...new Set(models)]; // Remove duplicatas
}

function getAvailableServices() {
  // Retorna lista de serviços disponíveis
  const services = [];
  const servicesDir = path.join(basePath, 'src', 'core', 'services');
  
  if (!fileExists(servicesDir)) return [];
  
  const files = fs.readdirSync(servicesDir);
  return files
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .map(file => file.replace('.ts', ''));
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
    
    // 2. Service (passa apenas o nome base, o sufixo "Service" será adicionado automaticamente)
    const serviceResult = await generateService(name, { skipValidation: true });
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
  // Converter para PascalCase e remover o sufixo "Service" se o usuário informar
  let pascalName = toPascalCase(name);
  
  // Remover o sufixo "Service" se o usuário informar (ex: "NoticiasService" -> "Noticias")
  const baseName = pascalName.replace(/Service$/, '');
  
  // Adicionar automaticamente o sufixo "Service" ao nome base
  const serviceName = `${baseName}Service`;
  const listName = options.listName || '';
  
  // Criar diretório se não existir
  const servicesDir = path.join(basePath, 'src', 'core', 'services');
  ensureDir(servicesDir);
  
  // Caminho do arquivo
  const filePath = path.join(servicesDir, `${serviceName}.ts`);
  
  if (fileExists(filePath)) {
    log.error(`Serviço ${serviceName} já existe!`);
    process.exit(1);
  }
  
  // Nome do model derivado do nome base (sem o sufixo "Service")
  const modelName = `I${baseName}`;
  
  // Verificar se o model já existe
  let modelInfo = null;
  let shouldGenerateModel = false;
  let extendModel = null;
  
  if (!options.skipModelCheck) {
    const existingModel = getModelPath(modelName);
    
    if (existingModel) {
      log.info(`📦 Model ${modelName} já existe em ${existingModel.relative}/`);
      
      // Apresentar opções ao usuário
      const { modelAction } = await prompts({
        type: 'select',
        name: 'modelAction',
        message: `O model ${modelName} já existe. O que deseja fazer?`,
        choices: [
          {
            title: '✅ Reutilizar o model existente',
            value: 'reuse',
            description: 'Não criar novo model, apenas importar o existente'
          },
          {
            title: '➕ Criar um novo model',
            value: 'create',
            description: 'Gerar um novo arquivo de model com o mesmo nome'
          },
          {
            title: '🔗 Criar um model estendendo outro',
            value: 'extend',
            description: 'Criar um novo model que estende um model existente'
          }
        ]
      });
      
      if (!modelAction) {
        log.info('Operação cancelada.');
        process.exit(0);
      }
      
      switch (modelAction) {
        case 'reuse':
          modelInfo = {
            name: modelName,
            path: existingModel.path,
            relative: existingModel.relative
          };
          log.success(`✅ Reutilizando model existente: ${modelName}`);
          break;
          
        case 'create':
          shouldGenerateModel = true;
          log.info(`➕ Criando novo model: ${modelName}`);
          break;
          
        case 'extend':
          // Listar models disponíveis para extensão
          const availableModels = getAvailableModels().filter(m => m !== modelName);
          
          if (availableModels.length === 0) {
            log.warn('Nenhum model disponível para estender. Criando novo model.');
            shouldGenerateModel = true;
          } else {
            const { selectedModel } = await prompts({
              type: 'select',
              name: 'selectedModel',
              message: 'Selecione o model base para estender:',
              choices: availableModels.map(m => ({
                title: m,
                value: m
              }))
            });
            
            if (!selectedModel) {
              log.info('Operação cancelada.');
              process.exit(0);
            }
            
            extendModel = selectedModel;
            shouldGenerateModel = true;
            log.info(`🔗 Criando model ${modelName} estendendo ${selectedModel}`);
          }
          break;
      }
    } else {
      // Model não existe, perguntar se deseja criar
      const { createModel } = await prompts({
        type: 'confirm',
        name: 'createModel',
        message: `Deseja criar o model ${modelName} para este serviço?`,
        initial: true
      });
      
      if (createModel) {
        shouldGenerateModel = true;
        log.info(`➕ Criando novo model: ${modelName}`);
      }
    }
  }
  
  // Gerar o model se necessário
  if (shouldGenerateModel) {
    const modelResult = await generateModel(baseName, { extendModel });
    if (modelResult) {
      modelInfo = {
        name: modelResult.modelName,
        path: modelResult.filePath,
        relative: 'src/models'
      };
    }
  }
  
  // Preparar opções para o template do serviço
  const serviceOptions = {
    ...options,
    modelName: modelInfo?.name || null
  };
  
  // Criar arquivo com opções (incluindo listName e model se fornecido)
  fs.writeFileSync(filePath, templates.service(serviceName, serviceOptions));
  log.success(`Arquivo criado: src/core/services/${serviceName}.ts`);
  
  // Criar teste
  if (options.withTest !== false) {
    const testsDir = path.join(basePath, 'tests', 'services');
    ensureDir(testsDir);
    const testPath = path.join(testsDir, `${serviceName}.test.ts`);
    fs.writeFileSync(testPath, templates.test(serviceName, 'service'));
    log.success(`Teste criado: tests/services/${serviceName}.test.ts`);
  }
  
  return { serviceName, filePath, modelInfo };
}

async function generateHook(name, options = {}) {
  // Normalizar o nome do hook: adicionar prefixo 'use' se não estiver presente
  let hookName;
  const nameLower = name.toLowerCase();
  
  if (nameLower.startsWith('use')) {
    // Se já começa com 'use', converter para PascalCase mantendo o prefixo
    const baseName = name.replace(/^use/i, '');
    hookName = 'use' + toPascalCase(baseName);
  } else {
    // Se não começa com 'use', adicionar o prefixo
    hookName = 'use' + toPascalCase(name);
  }
  
  log.info(`📝 Nome do hook: ${hookName}`);
  
  // Criar diretório se não existir
  const hooksDir = path.join(basePath, 'src', 'core', 'hooks');
  ensureDir(hooksDir);
  
  // Caminho do arquivo
  const filePath = path.join(hooksDir, `${hookName}.ts`);
  
  if (fileExists(filePath)) {
    log.error(`Hook ${hookName} já existe!`);
    process.exit(1);
  }
  
  // Obter o nome base do hook (sem o prefixo "use")
  const baseName = hookName.replace(/^use/i, '');
  
  // Verificar se existe um serviço com o mesmo nome (excluindo "Service")
  const availableServices = getAvailableServices();
  const matchingService = availableServices.find(s => s.toLowerCase() === baseName.toLowerCase() + 'service');
  
  // Log de informações sobre o serviço correspondente
  if (matchingService) {
    log.info(`🔗 Serviço correspondente encontrado: ${matchingService}`);
  }
  
  let selectedService = null;
  let selectedModels = [];
  
  // Se não estiver no modo interativo (CLI direto), usar valores padrão
  if (options.skipInteractive) {
    selectedService = options.serviceName || matchingService || null;
    selectedModels = options.models || [];
  } else {
    // Modo interativo: perguntar sobre serviço e models
    
    // 1. Seleção do serviço
    let serviceChoices = [];
    
    if (matchingService) {
      serviceChoices.push({
        title: `✅ ${matchingService} (corresponde ao hook ${hookName})`,
        value: matchingService,
        description: `Serviço com nome correspondente ao hook ${hookName}`
      });
    }
    
    // Adicionar outros serviços disponíveis
    const otherServices = availableServices.filter(s => s !== matchingService);
    otherServices.forEach(service => {
      serviceChoices.push({
        title: service,
        value: service
      });
    });
    
    serviceChoices.push({
      title: '❌ Nenhum serviço',
      value: null,
      description: 'Criar hook sem injeção de serviço'
    });
    
    const { service } = await prompts({
      type: 'select',
      name: 'service',
      message: 'Selecione o serviço para injetar no hook:',
      choices: serviceChoices,
      initial: matchingService ? 0 : serviceChoices.length - 1
    });
    
    if (service === undefined) {
      log.info('Operação cancelada.');
      process.exit(0);
    }
    
    selectedService = service;
    
    // 2. Seleção de models (múltipla)
    const availableModels = getAvailableModels();
    
    if (availableModels.length > 0) {
      const { models } = await prompts({
        type: 'multiselect',
        name: 'models',
        message: 'Selecione os models que este hook deve expor (use espaço para selecionar, enter para confirmar):',
        choices: availableModels.map(model => ({
          title: model,
          value: model
        })),
        hint: '- Espaço para selecionar/desmarcar, Enter para confirmar'
      });
      
      if (models === undefined) {
        log.info('Operação cancelada.');
        process.exit(0);
      }
      
      selectedModels = models || [];
    } else {
      log.info('Nenhum model disponível encontrado.');
    }
  }
  
  // Preparar opções para o template do hook
  const hookOptions = {
    ...options,
    models: selectedModels,
    serviceName: selectedService
  };
  
  // Criar arquivo com opções
  fs.writeFileSync(filePath, templates.hook(hookName, hookOptions));
  log.success(`Arquivo criado: src/core/hooks/${hookName}.ts`);
  
  // Exibir informações sobre o que foi configurado
  if (selectedService) {
    log.info(`📦 Serviço injetado em ${hookName}: ${selectedService}`);
  }
  if (selectedModels.length > 0) {
    log.info(`📦 Models expostos por ${hookName}: ${selectedModels.join(', ')}`);
  }
  
  // Criar teste
  if (options.withTest !== false) {
    const testsDir = path.join(basePath, 'tests', 'hooks');
    ensureDir(testsDir);
    const testPath = path.join(testsDir, `${hookName}.test.ts`);
    fs.writeFileSync(testPath, templates.test(hookName, 'hook'));
    log.success(`Teste criado: tests/hooks/${hookName}.test.ts`);
  }
  
  return { hookName, filePath, selectedService, selectedModels };
}

async function generateModel(name, options = {}) {
  const modelName = 'I' + toPascalCase(name);
  const { extendModel } = options || {};
  
  // Criar diretório se não existir
  const modelsDir = path.join(basePath, 'src', 'models');
  ensureDir(modelsDir);
  
  // Caminho do arquivo
  const filePath = path.join(modelsDir, `${modelName}.ts`);
  
  if (fileExists(filePath)) {
    log.error(`Model ${modelName} já existe!`);
    return false;
  }
  
  // Criar arquivo com opção de extensão
  fs.writeFileSync(filePath, templates.model(modelName, { extendModel }));
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
      },
      {
        type: 'confirm',
        name: 'withTest',
        message: 'Criar arquivo de teste para o serviço?',
        initial: true
      }
    ]);
    options = serviceOptions;
  }
  
  else if (artifactType === 'hook') {
    const hookOptions = await prompts([
      {
        type: 'confirm',
        name: 'withTest',
        message: 'Criar arquivo de teste para o hook?',
        initial: true
      }
    ]);
    options = hookOptions;
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
      result = await generateService(name, options);
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
${result.selectedService ? `│ ${colors.yellow}Serviço:${colors.reset}  ${result.selectedService}` : ''}
${result.selectedModels && result.selectedModels.length > 0 ? `│ ${colors.yellow}Models:${colors.reset}   ${result.selectedModels.join(', ')}` : ''}
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
    log.info('      pnpm run generate:service NomeDoServico (apenas o nome base, sem "Service")');
    log.info('      pnpm run generate:hook NomeDoHook (o prefixo "use" será adicionado automaticamente)');
    process.exit(1);
  }
  
  let result;
  let options = {};
  
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
      result = await generateService(name, options);
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
