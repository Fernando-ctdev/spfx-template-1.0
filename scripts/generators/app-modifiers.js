/**
 * ===============================================
 * MODIFICADORES DO APP.TSX
 * ===============================================
 *
 * Funções para modificar o App.tsx, adicionando
 * rotas, QueryClientProvider e itens de navegação.
 *
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const { log } = require('../utils/logger');
const { fileExists, getBasePath } = require('./file-helpers');

/**
 * Garante que o QueryClientProvider esteja configurado no App.tsx
 */
function ensureQueryClientProvider() {
  const basePath = getBasePath();
  const appPath = path.join(basePath, 'src', 'webparts', 'app', 'App.tsx');
  
  if (!fileExists(appPath)) {
    log.warn('App.tsx não encontrado. QueryClientProvider não adicionado.');
    return;
  }
  
  let content = fs.readFileSync(appPath, 'utf8');
  
  // Verifica se já tem QueryClientProvider
  if (content.includes('QueryClientProvider')) {
    log.info('QueryClientProvider já configurado no App.tsx.');
    return;
  }
  
  // Adiciona import do TanStack Query
  const hasTanStackImport = content.includes('@tanstack/react-query');
  if (!hasTanStackImport) {
    const firstImportRegex = /^import .+? from '.*?';$/m;
    const firstImport = content.match(firstImportRegex);
    if (firstImport) {
      content = content.replace(firstImportRegex, `${firstImport[0]}\nimport { QueryClient, QueryClientProvider } from '@tanstack/react-query';`);
    } else {
      log.warn('Não foi possível adicionar import do QueryClient automaticamente.');
      return;
    }
  }
  
  // Adiciona QueryClient antes do sp initialization
  const spInitRegex = /(const sp = React\.useMemo\(\) => \{)/;
  if (spInitRegex.test(content)) {
    content = content.replace(spInitRegex, `const queryClient = React.useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }), []);\n\n  $1`);
  } else {
    log.warn('Não foi possível adicionar QueryClient automaticamente.');
    return;
  }
  
  // Envolve o componente principal com QueryClientProvider
  const themeProviderStart = '<FluentProvider theme={webLightTheme}>';
  const themeProviderEnd = '</FluentProvider>';
  
  if (content.includes(themeProviderStart) && content.includes(themeProviderEnd)) {
    content = content.replace(
      `<${themeProviderStart}>\n      <SharePointContext.Provider value={sp}>`,
      `<QueryClientProvider client={queryClient}>\n      <FluentProvider theme={webLightTheme}>\n        <SharePointContext.Provider value={sp}>`
    );
    content = content.replace(
      `</SharePointContext.Provider>\n      </FluentProvider>`,
      `</SharePointContext.Provider>\n        </FluentProvider>\n    </QueryClientProvider>`
    );
  } else {
    log.warn('Não foi possível envolver componentes com QueryClientProvider.');
    return;
  }
  
  fs.writeFileSync(appPath, content);
  log.success('QueryClientProvider adicionado ao App.tsx.');
}

/**
 * Adiciona uma rota ao App.tsx
 * @param {string} pageName - Nome da página
 * @param {string} routePath - Caminho da rota
 */
function addRouteToApp(pageName, routePath) {
  const basePath = getBasePath();
  const appPath = path.join(basePath, 'src', 'webparts', 'app', 'App.tsx');
  
  if (!fileExists(appPath)) {
    log.warn('App.tsx não encontrado. Rota não adicionada automaticamente.');
    return;
  }
  
  let content = fs.readFileSync(appPath, 'utf8');
  const importMarker = '/* GENERATOR: IMPORT_PAGE */';
  const routeMarker = '{/* GENERATOR: ROUTE_PAGE */}';
  
  // 1. Adicionar Import
  const importStatement = `import ${pageName} from './pages/${pageName}';`;
  
  if (content.includes(importMarker)) {
    content = content.replace(importMarker, `${importStatement}\n${importMarker}`);
  } else {
    // Fallback: Tenta adicionar após o último import (modo legado)
    const importRegex = /import.*from ['"]\.\/pages\/.*['"];?/g;
    const imports = content.match(importRegex);
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const insertPosition = content.lastIndexOf(lastImport) + lastImport.length;
      content = content.slice(0, insertPosition) + '\n' + importStatement + content.slice(insertPosition);
    } else {
      log.warn(`Marcador '${importMarker}' não encontrado. Import adicionado de forma genérica.`);
      const lastImportIndex = content.lastIndexOf('import');
      const nextLineIndex = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, nextLineIndex + 1) + importStatement + '\n' + content.slice(nextLineIndex + 1);
    }
  }
  
  // 2. Adicionar Rota
  const routeStatement = `<Route path="${routePath}" element={<${pageName} />} />`;
  
  if (content.includes(routeMarker)) {
    content = content.replace(routeMarker, `${routeStatement}\n                ${routeMarker}`);
  } else {
    // Fallback: Tenta adicionar antes do NotFound
    const notFoundIndex = content.indexOf('<Route path="*"');
    if (notFoundIndex !== -1) {
      log.warn(`Marcador '${routeMarker}' não encontrado. Rota adicionada antes do NotFound.`);
      content = content.slice(0, notFoundIndex) + routeStatement + '\n          ' + content.slice(notFoundIndex);
    } else {
      log.error('Não foi possível adicionar a rota automaticamente. Adicione manualmente ao App.tsx');
      return;
    }
  }
  
  fs.writeFileSync(appPath, content);
  log.success(`Rota adicionada ao App.tsx: ${routePath}`);
}

/**
 * Adiciona um item ao menu de navegação
 * @param {string} name - Nome do item
 * @param {string} routePath - Caminho da rota
 */
function addNavigationItem(name, routePath) {
  const basePath = getBasePath();
  const navPath = path.join(basePath, 'src', 'webparts', 'app', 'config', 'navigation.ts');
  
  if (!fileExists(navPath)) {
    log.warn('navigation.ts não encontrado. Item de menu não adicionado.');
    return;
  }
  
  let content = fs.readFileSync(navPath, 'utf8');
  const iconMarker = '/* GENERATOR: IMPORT_ICON */';
  const itemMarker = '/* GENERATOR: NAV_ITEM */';
  
  // Verificar se já existe
  if (content.includes(`path: '${routePath}'`)) {
    log.warn('Rota já existe na navegação.');
    return;
  }

  // 1. Garantir import do ícone
  // Tenta usar o marcador primeiro
  if (!content.includes('FileText')) {
    if (content.includes(iconMarker)) {
       // Se o ícone FileText não estiver importado, importamos ele de uma nova linha ou editamos o existente?
       // Por simplicidade e segurança, vamos editar o import existente se possível
       if (content.includes("from 'lucide-react'")) {
         content = content.replace(/import { (.*?) } from 'lucide-react';/, (match, p1) => {
           return `import { ${p1}, FileText } from 'lucide-react';`;
         });
       } else {
         content = content.replace(iconMarker, `import { FileText } from 'lucide-react';\n${iconMarker}`);
       }
    } else {
      // Fallback regex antigo
      content = content.replace(/import { (.*?) } from 'lucide-react';/, (match, p1) => {
        return `import { ${p1}, FileText } from 'lucide-react';`;
      });
    }
  }

  // 2. Adicionar o item ao array
  const newItem = `
  {
    title: '${name}',
    path: '${routePath}',
    icon: FileText
  },`;

  if (content.includes(itemMarker)) {
    content = content.replace(itemMarker, `${newItem}\n  ${itemMarker}`);
    fs.writeFileSync(navPath, content);
    log.success(`Item adicionado ao menu: ${name}`);
  } else {
    // Fallback antigo
    const lastBracketIndex = content.lastIndexOf('];');
    if (lastBracketIndex !== -1) {
      log.warn(`Marcador '${itemMarker}' não encontrado. Item adicionado ao final do array.`);
      content = content.slice(0, lastBracketIndex) + newItem + '\n' + content.slice(lastBracketIndex);
      fs.writeFileSync(navPath, content);
      log.success(`Item adicionado ao menu: ${name}`);
    } else {
      log.error('Não foi possível encontrar o array de navegação em navigation.ts');
    }
  }
}

module.exports = {
  ensureQueryClientProvider,
  addRouteToApp,
  addNavigationItem
};
