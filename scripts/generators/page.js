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
const {
  createFileWithTracking,
  trackCreatedDir,
  shouldCancelOperation
} = require('../utils/interrupt-handler');

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
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
    trackCreatedDir(pagesDir);
  }

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

  // Criar arquivo com confirmação
  const pageCreated = await createFileWithTracking(
    filePath,
    templates.page(pageName, options),
    'Página',
    pageName
  );

  if (!pageCreated) {
    return { pageName, routePath, filePath: null, generatedFiles: [] };
  }

  // Verificar se o usuário cancelou a operação
  if (shouldCancelOperation()) {
    log.info('⏭️  Operação cancelada pelo usuário.');
    return { pageName, routePath, filePath: null, generatedFiles: [] };
  }

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
    if (!fs.existsSync(testsDir)) {
      fs.mkdirSync(testsDir, { recursive: true });
      trackCreatedDir(testsDir);
    }

    const testPath = path.join(testsDir, `${pageName}.test.tsx`);
    const testCreated = await createFileWithTracking(
      testPath,
      templates.test(pageName, 'page'),
      'Teste',
      `${pageName}.test`
    );

    if (testCreated) {
      generatedFiles.push({
        name: `${pageName}.test`,
        path: testPath,
        description: `Teste unitário do componente ${pageName}.`,
        type: 'test'
      });
    }
  }

  return { pageName, routePath, filePath, generatedFiles };
}

module.exports = {
  generatePage
};
