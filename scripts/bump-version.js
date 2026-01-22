const fs = require('fs');
const path = require('path');


const solutionConfigPath = path.resolve(__dirname, '../config/package-solution.json');


const log = (msg) => console.log(`\x1b[36m[Version Bump]\x1b[0m ${msg}`);
const logError = (msg) => console.error(`\x1b[31m[Version Bump Error]\x1b[0m ${msg}`);

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

    logError(`Aviso: Formato de versão incomum (${currentVersion}). Esperado: x.x.x.x`);
    if (parts.length < 4) {
        while (parts.length < 4) parts.push(0);
    }
  }


  parts[3]++; 

  const newVersion = parts.join('.');


  solutionConfig.solution.version = newVersion;


  fs.writeFileSync(solutionConfigPath, JSON.stringify(solutionConfig, null, 2) + '\n');

  log(`Sucesso! Versão atualizada: ${currentVersion} -> ${newVersion}`);

} catch (err) {
  logError(err.message);
  process.exit(1);
}
