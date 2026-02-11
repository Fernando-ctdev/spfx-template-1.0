/**
 * ===============================================
 * HANDLER DE INTERRUPÇÃO E CANCELAMENTO
 * ===============================================
 *
 * Módulo utilitário para gerenciar interrupções (Ctrl+C)
 * e cancelamentos durante a geração de arquivos.
 *
 * Funcionalidades:
 * - Captura de sinal SIGINT (Ctrl+C)
 * - Sistema de rollback para reverter alterações
 * - Confirmação antes de criar cada artefato
 * - Rastreamento de arquivos criados/modificados
 *
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { log } = require('./logger');

// Estado global para rastreamento
const state = {
  // Lista de arquivos criados (para rollback)
  createdFiles: [],
  // Lista de arquivos modificados com seus backups (para rollback)
  modifiedFiles: [],
  // Lista de diretórios criados (para rollback)
  createdDirs: [],
  // Flag para indicar se o processo está pausado
  isPaused: false,
  // Flag para indicar se o processo deve ser cancelado
  shouldCancel: false,
  // Flag para indicar se o handler está registrado
  isHandlerRegistered: false,
  // Interface readline para entrada do usuário
  rl: null
};

/**
 * Cria uma interface readline síncrona
 * @returns {readline.Interface} Interface readline
 */
function createReadlineInterface() {
  if (!state.rl) {
    state.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }
  return state.rl;
}

/**
 * Fecha a interface readline
 */
function closeReadlineInterface() {
  if (state.rl) {
    state.rl.close();
    state.rl = null;
  }
}

/**
 * Faz uma pergunta ao usuário de forma síncrona
 * @param {string} question - Pergunta a ser feita
 * @returns {Promise<string>} Resposta do usuário
 */
function askQuestion(question) {
  return new Promise((resolve) => {
    const rl = createReadlineInterface();
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Registra um arquivo criado para rollback
 * @param {string} filePath - Caminho do arquivo criado
 */
function trackCreatedFile(filePath) {
  state.createdFiles.push(filePath);
}

/**
 * Registra um diretório criado para rollback
 * @param {string} dirPath - Caminho do diretório criado
 */
function trackCreatedDir(dirPath) {
  state.createdDirs.push(dirPath);
}

/**
 * Registra um arquivo modificado com seu backup
 * @param {string} filePath - Caminho do arquivo modificado
 * @param {string} backupPath - Caminho do arquivo de backup
 */
function trackModifiedFile(filePath, backupPath) {
  state.modifiedFiles.push({
    originalPath: filePath,
    backupPath: backupPath
  });
}

/**
 * Cria um backup de um arquivo antes de modificá-lo
 * @param {string} filePath - Caminho do arquivo
 * @returns {string|null} Caminho do backup ou null se não foi possível criar
 */
function createBackup(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const backupDir = path.join(path.dirname(filePath), '.backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const fileName = path.basename(filePath);
    const timestamp = Date.now();
    const backupPath = path.join(backupDir, `${fileName}.${timestamp}.backup`);

    fs.copyFileSync(filePath, backupPath);

    return backupPath;
  } catch (error) {
    log.warn(`Não foi possível criar backup de ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Remove um arquivo de forma segura
 * @param {string} filePath - Caminho do arquivo
 */
function safeRemoveFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    log.warn(`Não foi possível remover ${filePath}: ${error.message}`);
  }
}

/**
 * Restaura um arquivo a partir de um backup
 * @param {string} filePath - Caminho do arquivo original
 * @param {string} backupPath - Caminho do backup
 */
function restoreFromBackup(filePath, backupPath) {
  try {
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, filePath);
      // Remove o backup após restauração
      safeRemoveFile(backupPath);
    }
  } catch (error) {
    log.warn(`Não foi possível restaurar ${filePath} de ${backupPath}: ${error.message}`);
  }
}

/**
 * Remove um diretório se estiver vazio
 * @param {string} dirPath - Caminho do diretório
 */
function safeRemoveEmptyDir(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      if (files.length === 0) {
        fs.rmdirSync(dirPath);
      }
    }
  } catch (error) {
    log.warn(`Não foi possível remover diretório ${dirPath}: ${error.message}`);
  }
}

/**
 * Remove o diretório de backups se estiver vazio
 */
function cleanupBackupDir() {
  const basePath = path.resolve(__dirname, '../..');
  const backupDir = path.join(basePath, '.backups');
  safeRemoveEmptyDir(backupDir);
}

/**
 * Executa o rollback de todas as alterações
 */
function executeRollback() {
  log.warn('\n🔄 Executando rollback das alterações...');

  // 1. Restaurar arquivos modificados (em ordem inversa)
  for (let i = state.modifiedFiles.length - 1; i >= 0; i--) {
    const { originalPath, backupPath } = state.modifiedFiles[i];
    restoreFromBackup(originalPath, backupPath);
  }

  // 2. Remover arquivos criados (em ordem inversa)
  for (let i = state.createdFiles.length - 1; i >= 0; i--) {
    const filePath = state.createdFiles[i];
    safeRemoveFile(filePath);
  }

  // 3. Remover diretórios criados (em ordem inversa)
  for (let i = state.createdDirs.length - 1; i >= 0; i--) {
    const dirPath = state.createdDirs[i];
    safeRemoveEmptyDir(dirPath);
  }

  // 4. Limpar diretório de backups
  cleanupBackupDir();

  log.warn('✅ Rollback concluído.\n');
}

/**
 * Limpa o estado do handler
 */
function clearState() {
  state.createdFiles = [];
  state.modifiedFiles = [];
  state.createdDirs = [];
  state.isPaused = false;
  state.shouldCancel = false;
}

/**
 * Handler para o sinal SIGINT (Ctrl+C)
 */
function handleSIGINT() {
  if (state.isPaused) {
    // Já está pausado, não fazer nada
    return;
  }

  state.isPaused = true;
  console.log('\n');

  askQuestion('Deseja cancelar a operação? [y/n]: ')
    .then((answer) => {
      state.isPaused = false;

      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        state.shouldCancel = true;
        log.warn('\n⚠️  Operação cancelada pelo usuário.');
        executeRollback();
        closeReadlineInterface();
        // Não chamar process.exit() aqui - deixar o código principal verificar shouldCancelOperation()
      } else {
        log.info('\n▶️  Retomando a operação...\n');
      }
    })
    .catch((error) => {
      log.error(`Erro ao processar resposta: ${error.message}`);
      state.isPaused = false;
    });
}

/**
 * Registra o handler de SIGINT
 */
function registerInterruptHandler() {
  if (state.isHandlerRegistered) {
    return;
  }

  process.on('SIGINT', handleSIGINT);
  state.isHandlerRegistered = true;
}

/**
 * Remove o handler de SIGINT
 */
function unregisterInterruptHandler() {
  if (state.isHandlerRegistered) {
    process.removeListener('SIGINT', handleSIGINT);
    state.isHandlerRegistered = false;
  }
}

/**
 * Verifica se o processo deve ser cancelado
 * @returns {boolean} True se deve cancelar
 */
function shouldCancelOperation() {
  return state.shouldCancel;
}

/**
 * Confirma a criação de um artefato
 * @param {string} artifactType - Tipo do artefato (ex: "Página", "Componente", "Serviço")
 * @param {string} artifactName - Nome do artefato
 * @returns {Promise<boolean>} True se o usuário confirmou
 */
async function confirmArtifactCreation(artifactType, artifactName) {
  const question = `Confirma a criação deste ${artifactType} (${artifactName})? [y/n]: `;
  const answer = await askQuestion(question);
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

/**
 * Wrapper para criação de arquivo com rastreamento
 * @param {string} filePath - Caminho do arquivo
 * @param {string} content - Conteúdo do arquivo
 * @param {string} artifactType - Tipo do artefato
 * @param {string} artifactName - Nome do artefato
 * @returns {Promise<boolean>} True se o arquivo foi criado
 */
async function createFileWithTracking(filePath, content, artifactType, artifactName) {
  // Verificar se deve cancelar
  if (shouldCancelOperation()) {
    return false;
  }

  // Confirmar criação
  const confirmed = await confirmArtifactCreation(artifactType, artifactName);
  if (!confirmed) {
    log.info(`⏭️  Criação de ${artifactType} ${artifactName} pulada pelo usuário.`);
    return false;
  }

  // Criar diretório se não existir
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    trackCreatedDir(dirPath);
  }

  // Criar arquivo
  fs.writeFileSync(filePath, content);
  trackCreatedFile(filePath);
  log.success(`Arquivo criado: ${filePath}`);

  return true;
}

/**
 * Wrapper para modificação de arquivo com backup
 * @param {string} filePath - Caminho do arquivo
 * @param {string} newContent - Novo conteúdo
 * @returns {boolean} True se o arquivo foi modificado
 */
function modifyFileWithBackup(filePath, newContent) {
  // Verificar se deve cancelar
  if (shouldCancelOperation()) {
    return false;
  }

  // Criar backup
  const backupPath = createBackup(filePath);
  if (backupPath) {
    trackModifiedFile(filePath, backupPath);
  }

  // Modificar arquivo
  fs.writeFileSync(filePath, newContent);
  log.success(`Arquivo modificado: ${filePath}`);

  return true;
}

/**
 * Finaliza o handler (limpa recursos)
 */
function finalize() {
  unregisterInterruptHandler();
  closeReadlineInterface();
  clearState();
}

module.exports = {
  // Funções de registro
  registerInterruptHandler,
  unregisterInterruptHandler,

  // Funções de rastreamento
  trackCreatedFile,
  trackCreatedDir,
  trackModifiedFile,
  createBackup,

  // Funções de rollback
  executeRollback,
  clearState,

  // Funções de confirmação
  confirmArtifactCreation,
  shouldCancelOperation,

  // Funções de wrapper
  createFileWithTracking,
  modifyFileWithBackup,

  // Funções de finalização
  finalize,

  // Funções auxiliares
  askQuestion
};
