/**
 * ===============================================
 * PONTO DE ENTRADA PRINCIPAL
 * ===============================================
 *
 * Exporta todas as funções dos módulos do gerador.
 * Este arquivo serve como interface principal para
 * o arquivo generate.js.
 *
 * ===============================================
 */

// Funções utilitárias
const { toPascalCase, toCamelCase, toKebabCase } = require('./utils');

// Funções de arquivo
const {
  ensureDir,
  fileExists,
  modelExists,
  getModelPath,
  getAvailableModels,
  getAvailableServices,
  getBasePath
} = require('./file-helpers');

// Geradores
const { generatePage } = require('./page');
const { generateComponent } = require('./component');
const { generateService } = require('./service');
const { generateHook } = require('./hook');
const { generateModel } = require('./model');

// Modificadores do App.tsx
const {
  ensureQueryClientProvider,
  addRouteToApp,
  addNavigationItem
} = require('./app-modifiers');

// Modo interativo
const { interactiveMode, showSummary } = require('./interactive');

module.exports = {
  // Funções utilitárias
  toPascalCase,
  toCamelCase,
  toKebabCase,
  
  // Funções de arquivo
  ensureDir,
  fileExists,
  modelExists,
  getModelPath,
  getAvailableModels,
  getAvailableServices,
  getBasePath,
  
  // Geradores
  generatePage,
  generateComponent,
  generateService,
  generateHook,
  generateModel,
  
  // Modificadores do App.tsx
  ensureQueryClientProvider,
  addRouteToApp,
  addNavigationItem,
  
  // Modo interativo
  interactiveMode,
  showSummary
};
