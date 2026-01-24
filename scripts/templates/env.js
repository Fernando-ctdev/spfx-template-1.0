module.exports = (answers) => `
# Configurações do Ambiente SPFx
# Gerado automaticamente em ${new Date().toISOString()}

SPFX_TENANT=${answers.tenant}
SPFX_SITE_URL=${answers.siteUrl}
SPFX_APP_NAME=${answers.appName}
SPFX_APP_TITLE=${answers.appTitle}
SPFX_MODE=${answers.mode}

# Configurações de Build
NODE_ENV=development
`.trim();
