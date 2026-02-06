/**
 * ===============================================
 * GERADOR DE PÁGINAS
 * ===============================================
 *
 * Funções para geração de páginas com suporte a
 * CRUD completo (model, service, hook, page).
 *
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const templates = require('../templates');
const { log } = require('../utils/logger');
const { ensureDir, fileExists, getBasePath } = require('./file-helpers');
const { toPascalCase, toKebabCase } = require('./utils');
const { generateModel } = require('./model');
const { generateService } = require('./service');
const { generateHook } = require('./hook');
const { ensureQueryClientProvider, addRouteToApp, addNavigationItem } = require('./app-modifiers');

/**
 * Gera uma nova página com suporte a CRUD completo
 * @param {string} name - Nome da página
 * @param {object} options - Opções adicionais
 * @param {string} options.route - Caminho da rota
 * @param {boolean} options.addRoute - Adicionar rota ao App.tsx
 * @param {boolean} options.addToNav - Adicionar ao menu de navegação
 * @param {boolean} options.createCRUD - Criar stack CRUD completa
 * @param {string} options.listName - Nome da lista SharePoint
 * @param {string} options.crudMode - Modo CRUD ('read' ou 'crud')
 * @param {boolean} options.withSharePoint - Incluir código de exemplo do SharePoint
 * @param {boolean} options.withTest - Criar arquivo de teste
 * @returns {object} Objeto com pageName, routePath, filePath e generatedFiles
 */
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
  
  const basePath = getBasePath();
  
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

module.exports = {
  generatePage
};
