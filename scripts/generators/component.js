/**
 * ===============================================
 * GERADOR DE COMPONENTES
 * ===============================================
 *
 * Funções para geração de componentes React
 * reutilizáveis.
 *
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const templates = require('../templates');
const { log } = require('../utils/logger');
const { ensureDir, fileExists, getBasePath } = require('./file-helpers');
const { toPascalCase } = require('./utils');

/**
 * Gera um novo componente React
 * @param {string} name - Nome do componente
 * @param {object} options - Opções adicionais
 * @param {boolean} options.withProps - Incluir interface de Props de exemplo
 * @returns {object} Objeto com componentName e filePath
 */
async function generateComponent(name, options = {}) {
  const componentName = toPascalCase(name);
  const withProps = options.withProps !== false;
  
  const basePath = getBasePath();
  
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

module.exports = {
  generateComponent
};
