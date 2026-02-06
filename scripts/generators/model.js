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

module.exports = {
  generateModel
};
