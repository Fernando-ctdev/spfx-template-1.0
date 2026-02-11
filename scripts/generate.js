/**
 * ===============================================
 * 🎨 GERADOR DE COMPONENTES/PÁGINAS SPFx
 * ===============================================
 *
 * Gera automaticamente páginas, componentes, serviços e hooks
 * para projetos SharePoint SPFx.
 *
 * Uso:
 *   pnpm run generate:page NomeDaPagina
 *   pnpm run generate:component NomeDoComponente
 *   pnpm run generate:service NomeDoServico (apenas o nome base, sem "Service")
 *   pnpm run generate:hook NomeDoHook (o prefixo "use" será adicionado automaticamente)
 *   pnpm run generate (modo interativo com menu)
 *
 * ===============================================
 */

const { log } = require('./utils/logger');
const generators = require('./generators');
const {
  registerInterruptHandler,
  finalize,
  shouldCancelOperation
} = require('./utils/interrupt-handler');

// ============================================
// MAIN
// ============================================

async function main() {
  // Registrar handler de SIGINT
  registerInterruptHandler();

  const args = process.argv.slice(2);
  const command = args[0];
  const name = args[1];

  if (!command) {
    await generators.interactiveMode();
    finalize();
    return;
  }

  // Suporte a modo legacy (argumentos via CLI)
  if (!name) {
    log.error('Nome é obrigatório no modo CLI!');
    log.info('Uso: pnpm run generate:page NomeDaPagina');
    log.info('      pnpm run generate:service NomeDoServico (apenas o nome base, sem "Service")');
    log.info('      pnpm run generate:hook NomeDoHook (o prefixo "use" será adicionado automaticamente)');
    finalize();
    process.exit(1);
  }

  let result;
  let options = {};

  switch (command) {
    case 'page':
      result = await generators.generatePage(name);
      if (result && result.filePath) generators.showSummary('Página', result);
      else if (result && !result.filePath) log.info('⏭️  Operação cancelada pelo usuário.');
      break;

    case 'component':
      result = await generators.generateComponent(name);
      if (result && result.filePath) generators.showSummary('Componente', result);
      else if (result && !result.filePath) log.info('⏭️  Operação cancelada pelo usuário.');
      break;

    case 'service':
      result = await generators.generateService(name, options);
      if (result && result.filePath) generators.showSummary('Serviço', result);
      else if (result && !result.filePath) log.info('⏭️  Operação cancelada pelo usuário.');
      break;

    case 'hook':
      result = await generators.generateHook(name);
      if (result && result.filePath) generators.showSummary('Hook', result);
      else if (result && !result.filePath) log.info('⏭️  Operação cancelada pelo usuário.');
      break;

    case 'model':
      result = await generators.generateModel(name);
      if (result && result.filePath) generators.showSummary('Model', result);
      else if (result === false) log.info('⏭️  Operação cancelada pelo usuário.');
      break;

    default:
      log.error(`Comando desconhecido: ${command}`);
      log.info('Use "pnpm run generate" para o modo interativo.');
      finalize();
      process.exit(1);
  }

  // Finalizar handler
  finalize();
}

module.exports = {
  generatePage: generators.generatePage,
  generateComponent: generators.generateComponent,
  generateService: generators.generateService,
  generateHook: generators.generateHook,
  generateModel: generators.generateModel
};

if (require.main === module) {
  main().catch((error) => {
    log.error(`Erro: ${error.message}`);
    process.exit(1);
  });
}
