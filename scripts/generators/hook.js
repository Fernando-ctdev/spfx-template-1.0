/**
 * ===============================================
 * GERADOR DE HOOKS
 * ===============================================
 *
 * Funções para geração de React Hooks customizados
 * com suporte a injeção de serviços e models.
 *
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const templates = require('../templates');
const { log } = require('../utils/logger');
const { ensureDir, fileExists, getBasePath, getAvailableServices, getAvailableModels } = require('./file-helpers');
const { toPascalCase } = require('./utils');
const {
  createFileWithTracking,
  trackCreatedDir,
  shouldCancelOperation
} = require('../utils/interrupt-handler');

/**
 * Gera um novo React Hook customizado
 * @param {string} name - Nome do hook (o prefixo "use" será adicionado automaticamente)
 * @param {object} options - Opções adicionais
 * @param {boolean} options.skipInteractive - Pular modo interativo
 * @param {string} options.serviceName - Nome do serviço a injetar (modo não interativo)
 * @param {string[]} options.models - Lista de models a expor (modo não interativo)
 * @param {boolean} options.withTest - Criar arquivo de teste
 * @returns {object} Objeto com hookName, filePath, selectedService e selectedModels
 */
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
  
  const basePath = getBasePath();

  // Criar diretório se não existir
  const hooksDir = path.join(basePath, 'src', 'core', 'hooks');
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
    trackCreatedDir(hooksDir);
  }

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
        message: 'Selecione os models que este hook deve expor:',
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
  const hookCreated = await createFileWithTracking(
    filePath,
    templates.hook(hookName, hookOptions),
    'Hook',
    hookName
  );

  if (!hookCreated) {
    return { hookName, filePath: null, selectedService, selectedModels };
  }

  // Verificar se o usuário cancelou a operação
  if (shouldCancelOperation()) {
    log.info('⏭️  Operação cancelada pelo usuário.');
    return { hookName, filePath: null, selectedService, selectedModels };
  }

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
    if (!fs.existsSync(testsDir)) {
      fs.mkdirSync(testsDir, { recursive: true });
      trackCreatedDir(testsDir);
    }

    const testPath = path.join(testsDir, `${hookName}.test.ts`);
    await createFileWithTracking(
      testPath,
      templates.test(hookName, 'hook'),
      'Teste',
      `${hookName}.test`
    );
  }

  return { hookName, filePath, selectedService, selectedModels };
}

module.exports = {
  generateHook
};
