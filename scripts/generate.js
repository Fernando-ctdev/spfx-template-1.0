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

// ============================================
// MAIN
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const name = args[1];
  
  if (!command) {
    await generators.interactiveMode();
    return;
  }
  
  // Suporte a modo legacy (argumentos via CLI)
  if (!name) {
    log.error('Nome é obrigatório no modo CLI!');
    log.info('Uso: pnpm run generate:page NomeDaPagina');
    log.info('      pnpm run generate:service NomeDoServico (apenas o nome base, sem "Service")');
    log.info('      pnpm run generate:hook NomeDoHook (o prefixo "use" será adicionado automaticamente)');
    process.exit(1);
  }
  
  let result;
  let options = {};
  
  switch (command) {
    case 'page':
      result = await generators.generatePage(name);
      if (result) generators.showSummary('Página', result);
      break;
      
    case 'component':
      result = await generators.generateComponent(name);
      if (result) generators.showSummary('Componente', result);
      break;
      
    case 'service':
      result = await generators.generateService(name, options);
      if (result) generators.showSummary('Serviço', result);
      break;
      
    case 'hook':
      result = await generators.generateHook(name);
      if (result) generators.showSummary('Hook', result);
      break;
      
    case 'model':
      result = await generators.generateModel(name);
      if (result) generators.showSummary('Model', result);
      break;
      
    default:
      log.error(`Comando desconhecido: ${command}`);
      log.info('Use "pnpm run generate" para o modo interativo.');
      process.exit(1);
  }
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
