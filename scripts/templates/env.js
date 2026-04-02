module.exports = (answers) => `
# Configurações do Ambiente SPFx
# Gerado automaticamente em ${new Date().toISOString()}

SPFX_TENANT=${answers.tenant}
SPFX_SITE_URL=${answers.siteUrl}
SPFX_APP_NAME=${answers.appName}
SPFX_APP_TITLE=${answers.appTitle}
SPFX_MODE=${answers.mode}
SPFX_LAYOUT=${answers.layout}
SPFX_NAVIGATION_SCOPE=${answers.navigationScope}
SPFX_HIDE_NATIVE_UI=${answers.hideNativeUI}
SPFX_HIDE_SCOPE=${answers.hideScope}
SPFX_HIDE_TARGET_PAGE_SLUG=${answers.hideTargetPageSlug}
SPFX_HIDE_LEVELS=${(answers.hideLevels || []).join(',')}

# Configurações de Build
NODE_ENV=development
`.trim();
