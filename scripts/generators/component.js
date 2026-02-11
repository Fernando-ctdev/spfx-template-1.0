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
const {
  createFileWithTracking,
  trackCreatedDir,
  shouldCancelOperation
} = require('../utils/interrupt-handler');

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
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
    trackCreatedDir(componentsDir);
  }

  // Caminho do arquivo
  const filePath = path.join(componentsDir, `${componentName}.tsx`);

  if (fileExists(filePath)) {
    log.error(`Componente ${componentName} já existe!`);
    process.exit(1);
  }

  // Criar arquivo com confirmação
  const componentCreated = await createFileWithTracking(
    filePath,
    templates.component(componentName, withProps),
    'Componente',
    componentName
  );

  if (!componentCreated) {
    return { componentName, filePath: null };
  }

  // Verificar se o usuário cancelou a operação
  if (shouldCancelOperation()) {
    log.info('⏭️  Operação cancelada pelo usuário.');
    return { componentName, filePath: null };
  }

  // Criar teste
  if (options.withTest !== false) {
    const testsDir = path.join(basePath, 'tests', 'components');
    if (!fs.existsSync(testsDir)) {
      fs.mkdirSync(testsDir, { recursive: true });
      trackCreatedDir(testsDir);
    }

    const testPath = path.join(testsDir, `${componentName}.test.tsx`);
    await createFileWithTracking(
      testPath,
      templates.test(componentName, 'component'),
      'Teste',
      `${componentName}.test`
    );
  }

  return { componentName, filePath };
}

module.exports = {
  generateComponent
};
