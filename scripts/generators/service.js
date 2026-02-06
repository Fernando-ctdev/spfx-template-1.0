/**
 * ===============================================
 * GERADOR DE SERVIÇOS
 * ===============================================
 *
 * Funções para geração de serviços PnP/SharePoint
 * com suporte a CRUD.
 *
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const templates = require('../templates');
const { log } = require('../utils/logger');
const { ensureDir, fileExists, getBasePath, getModelPath, getAvailableModels } = require('./file-helpers');
const { toPascalCase } = require('./utils');
const { generateModel } = require('./model');

/**
 * Gera um novo serviço PnP/SharePoint
 * @param {string} name - Nome do serviço (apenas o nome base, sem "Service")
 * @param {object} options - Opções adicionais
 * @param {string} options.listName - Nome da lista SharePoint
 * @param {boolean} options.skipModelCheck - Pular verificação de model existente
 * @param {boolean} options.withTest - Criar arquivo de teste
 * @returns {object} Objeto com serviceName, filePath e modelInfo
 */
async function generateService(name, options = {}) {
  // Converter para PascalCase e remover o sufixo "Service" se o usuário informar
  let pascalName = toPascalCase(name);
  
  // Remover o sufixo "Service" se o usuário informar (ex: "NoticiasService" -> "Noticias")
  const baseName = pascalName.replace(/Service$/, '');
  
  // Adicionar automaticamente o sufixo "Service" ao nome base
  const serviceName = `${baseName}Service`;
  const listName = options.listName || '';
  
  const basePath = getBasePath();
  
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

module.exports = {
  generateService
};
