const fs = require('fs');
const path = require('path');

// Caminho para o arquivo package-solution.json
const solutionConfigPath = path.resolve(__dirname, '../config/package-solution.json');

// Função de log simples
const log = (msg) => console.log(`\x1b[36m[Version Bump]\x1b[0m ${msg}`);
const logError = (msg) => console.error(`\x1b[31m[Version Bump Error]\x1b[0m ${msg}`);

try {
  // 1. Verificar existência do arquivo
  if (!fs.existsSync(solutionConfigPath)) {
    throw new Error(`Arquivo não encontrado: ${solutionConfigPath}`);
  }

  // 2. Ler o arquivo
  // Usamos fs.readFileSync para garantir que pegamos o conteúdo cru, preservando o objeto JSON
  const fileContent = fs.readFileSync(solutionConfigPath, 'utf8');
  const solutionConfig = JSON.parse(fileContent);

  // 3. Validar estrutura
  if (!solutionConfig.solution || !solutionConfig.solution.version) {
    throw new Error('Estrutura inválida no package-solution.json: campo solution.version ausente.');
  }

  const currentVersion = solutionConfig.solution.version;
  
  // 4. Parsear versão (formato esperado: Major.Minor.Build.Revision)
  // Ex: 1.0.0.0
  const parts = currentVersion.split('.').map(part => {
    const num = parseInt(part, 10);
    if (isNaN(num)) throw new Error(`Segmento de versão inválido: ${part}`);
    return num;
  });

  if (parts.length !== 4) {
    // Se não for 4 partes, tenta adaptar ou lança erro. SPFx exige 4 partes.
    logError(`Aviso: Formato de versão incomum (${currentVersion}). Esperado: x.x.x.x`);
    if (parts.length < 4) {
        while (parts.length < 4) parts.push(0);
    }
  }

  // 5. Incrementar a versão
  // Estratégia: Incrementar o último dígito (Revision)
  // Se o usuário quiser Major/Minor, deve fazer manualmente.
  parts[3]++; 

  const newVersion = parts.join('.');

  // 6. Atualizar objeto
  solutionConfig.solution.version = newVersion;

  // 7. Salvar arquivo
  // Detectar indentação original seria ideal, mas assumiremos 2 espaços conforme padrão SPFx
  fs.writeFileSync(solutionConfigPath, JSON.stringify(solutionConfig, null, 2) + '\n');

  log(`Sucesso! Versão atualizada: ${currentVersion} -> ${newVersion}`);

} catch (err) {
  logError(err.message);
  process.exit(1);
}
