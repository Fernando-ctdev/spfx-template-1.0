/**
 * ===============================================
 * GERADOR DE MODELS
 * ===============================================
 *
 * Funções para geração de interfaces TypeScript
 * (models) para o projeto.
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
 * Gera um novo model (interface TypeScript)
 * @param {string} name - Nome do model
 * @param {object} options - Opções adicionais
 * @param {string} options.extendModel - Nome do model a ser estendido
 * @returns {object|null} Objeto com modelName e filePath ou null
 */
async function generateModel(name, options = {}) {
  const modelName = 'I' + toPascalCase(name);
  const { extendModel } = options || {};

  const basePath = getBasePath();

  // Criar diretório se não existir
  const modelsDir = path.join(basePath, 'src', 'models');
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
    trackCreatedDir(modelsDir);
  }

  // Caminho do arquivo
  const filePath = path.join(modelsDir, `${modelName}.ts`);

  if (fileExists(filePath)) {
    log.error(`Model ${modelName} já existe!`);
    return false;
  }

  // Criar arquivo com opção de extensão
  const modelCreated = await createFileWithTracking(
    filePath,
    templates.model(modelName, { extendModel }),
    'Model',
    modelName
  );

  if (!modelCreated) {
    return false;
  }

  // Verificar se o usuário cancelou a operação
  if (shouldCancelOperation()) {
    log.info('⏭️  Operação cancelada pelo usuário.');
    return false;
  }

  return { modelName, filePath };
}

module.exports = {
  generateModel
};
