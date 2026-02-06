/**
 * ===============================================
 * FUNÇÕES AUXILIARES DE ARQUIVO
 * ===============================================
 *
 * Funções para manipulação de arquivos e diretórios,
 * verificação de existência e obtenção de caminhos.
 *
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const { log } = require('../utils/logger');

const basePath = path.resolve(__dirname, '../..');

/**
 * Cria um diretório se não existir
 * @param {string} dirPath - Caminho do diretório
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log.success(`Diretório criado: ${dirPath}`);
  }
}

/**
 * Verifica se um arquivo existe
 * @param {string} filePath - Caminho do arquivo
 * @returns {boolean} True se o arquivo existe
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Verifica se um model existe em src/models ou lib/models
 * @param {string} modelName - Nome do model
 * @returns {boolean} True se o model existe
 */
function modelExists(modelName) {
  const modelsDirSrc = path.join(basePath, 'src', 'models');
  const modelsDirLib = path.join(basePath, 'lib', 'models');
  
  const modelPathSrc = path.join(modelsDirSrc, `${modelName}.ts`);
  const modelPathLib = path.join(modelsDirLib, `${modelName}.ts`);
  
  return fileExists(modelPathSrc) || fileExists(modelPathLib);
}

/**
 * Retorna o caminho do model se existir
 * @param {string} modelName - Nome do model
 * @returns {object|null} Objeto com path e relative ou null
 */
function getModelPath(modelName) {
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

/**
 * Retorna lista de models disponíveis
 * @returns {string[]} Lista de nomes de models
 */
function getAvailableModels() {
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

/**
 * Retorna lista de serviços disponíveis
 * @returns {string[]} Lista de nomes de serviços
 */
function getAvailableServices() {
  const services = [];
  const servicesDir = path.join(basePath, 'src', 'core', 'services');
  
  if (!fileExists(servicesDir)) return [];
  
  const files = fs.readdirSync(servicesDir);
  return files
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .map(file => file.replace('.ts', ''));
}

/**
 * Retorna o caminho base do projeto
 * @returns {string} Caminho base do projeto
 */
function getBasePath() {
  return basePath;
}

module.exports = {
  ensureDir,
  fileExists,
  modelExists,
  getModelPath,
  getAvailableModels,
  getAvailableServices,
  getBasePath
};
