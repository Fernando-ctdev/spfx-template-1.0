/**
 * ===============================================
 * GERADOR DE PÁGINAS (SIMPLIFICADO)
 * ===============================================
 *
 * Funções para geração de páginas simples
 * (apenas arquivo React e configuração de rota).
 *
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const templates = require('../templates');
const { log } = require('../utils/logger');
const { ensureDir, fileExists, getBasePath } = require('./file-helpers');
const { toPascalCase, toKebabCase } = require('./utils');
const { addRouteToApp, addNavigationItem } = require('./app-modifiers');

/**
 * Gera uma nova página simples
 * @param {string} name - Nome da página
 * @param {object} options - Opções adicionais
 * @returns {object} Objeto com pageName, routePath, filePath e generatedFiles
 */
async function generatePage(name, options = {}) {
  const pageName = toPascalCase(name);
  const routePath = options.route || `/${toKebabCase(name)}`;
  
  const generatedFiles = [];
  
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
    description: `Componente React principal.`,
    type: 'page'
  });
  
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
  
  // Criar teste sempre simplificado
  if (options.withTest !== false) {
    const testsDir = path.join(basePath, 'tests', 'pages');
    ensureDir(testsDir);
    const testPath = path.join(testsDir, `${pageName}.test.tsx`);
    fs.writeFileSync(testPath, templates.test(pageName, 'page'));
    log.success(`Teste criado: tests/pages/${pageName}.test.tsx`);
    
    generatedFiles.push({
      name: `${pageName}.test`,
      path: testPath,
      description: `Teste unitário do componente ${pageName}.`,
      type: 'test'
    });
  }
  
  return { pageName, routePath, filePath, generatedFiles };
}

module.exports = {
  generatePage
};
