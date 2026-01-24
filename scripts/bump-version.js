/**
 * ===============================================
 * 🆙 BUMP VERSION
 * ===============================================
 * 
 * Incrementa automaticamente a versão do pacote (revision)
 * no arquivo config/package-solution.json antes do build.
 * 
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const { log, colors } = require('./utils/logger');

const solutionConfigPath = path.resolve(__dirname, '../config/package-solution.json');

function main() {
  log.title('VERSION BUMP AUTOMATION');

  try {
    if (!fs.existsSync(solutionConfigPath)) {
      throw new Error(`Arquivo não encontrado: ${solutionConfigPath}`);
    }

    const fileContent = fs.readFileSync(solutionConfigPath, 'utf8');
    const solutionConfig = JSON.parse(fileContent);

    if (!solutionConfig.solution || !solutionConfig.solution.version) {
      throw new Error('Estrutura inválida no package-solution.json: campo solution.version ausente.');
    }

    const currentVersion = solutionConfig.solution.version;
    const parts = currentVersion.split('.').map(part => {
      const num = parseInt(part, 10);
      if (isNaN(num)) throw new Error(`Segmento de versão inválido: ${part}`);
      return num;
    });

    if (parts.length !== 4) {
      log.warn(`Formato de versão incomum (${currentVersion}). Esperado: x.x.x.x. Ajustando...`);
      while (parts.length < 4) parts.push(0);
    }

    // Incrementar Revision (quarta parte)
    parts[3]++; 

    const newVersion = parts.join('.');
    solutionConfig.solution.version = newVersion;

    fs.writeFileSync(solutionConfigPath, JSON.stringify(solutionConfig, null, 2) + '\n');

    console.log(`
${colors.cyan}┌─────────────────────────────────────────────────────┐
│  ${colors.green}✔ Versão Atualizada com Sucesso!${colors.reset}                   │
├─────────────────────────────────────────────────────┤${colors.reset}
│  De:   ${colors.yellow}${currentVersion}${colors.reset}
│  Para: ${colors.green}${newVersion}${colors.reset}
${colors.cyan}└─────────────────────────────────────────────────────┘${colors.reset}
`);

  } catch (err) {
    log.error(err.message);
    process.exit(1);
  }
}

main();
