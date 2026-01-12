/**
 * ===============================================
 * 🎨 GERADOR DE COMPONENTES/PÁGINAS SPFx
 * ===============================================
 * 
 * Gera automaticamente páginas, componentes, serviços e hooks
 * para projetos SharePoint SPFx.
 * 
 * Uso:
 *   npm run generate:page NomeDaPagina
 *   npm run generate:component NomeDoComponente
 *   npm run generate:service NomeDoServico
 *   npm run generate:hook useNomeDoHook
 *   npm run generate (modo interativo)
 * 
 * ===============================================
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✔${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✖${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.cyan}${'='.repeat(50)}\n${msg}\n${'='.repeat(50)}${colors.reset}\n`)
};

const basePath = path.resolve(__dirname, '..');

// Interface readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// ============================================
// TEMPLATES (Fluent UI v8 - Padrão | Radix UI - Apenas exceções)
// ============================================

const templates = {
  page: (name, withSharePoint) => `import * as React from 'react';
import { mergeStyleSets, getTheme, Text, Spinner, SpinnerSize, MessageBar, MessageBarType } from '@fluentui/react';${withSharePoint ? `
import { useListItems } from '../../../core/hooks/useSharePoint';` : ''}

const theme = getTheme();

const styles = mergeStyleSets({
  container: {
    padding: theme.spacing.l2,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.l1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.m,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing.l2,
  },
});

/**
 * Página ${name}
 * 
 * @description Descrição da página ${name}
 */
const ${name}: React.FC = () => {${withSharePoint ? `
  
  // Exemplo de uso do hook useListItems
  // const { items, loading, error } = useListItems('NomeDaLista', ['Id', 'Title']);
  
  // if (loading) return <div className={styles.loading}><Spinner size={SpinnerSize.large} label="Carregando..." /></div>;
  // if (error) return <MessageBar messageBarType={MessageBarType.error}>{error.message}</MessageBar>;` : ''}

  return (
    <div className={styles.container}>
      <Text variant="xxLarge" block>${name}</Text>
      <div className={styles.content}>
        <Text variant="medium">Conteúdo da página ${name}</Text>
        
        {/* Seu conteúdo aqui */}
      </div>
    </div>
  );
};

export default ${name};
`,

  component: (name, withProps) => `import * as React from 'react';
import { mergeStyleSets, getTheme } from '@fluentui/react';

const theme = getTheme();

const styles = mergeStyleSets({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.s1,
  },
});

/**
 * Props do componente ${name}
 */
export interface I${name}Props {${withProps ? `
  title?: string;
  description?: string;` : `
  // Adicione suas props aqui`}
}

/**
 * Componente ${name}
 * 
 * @description Descrição do componente ${name}
 */
const ${name}: React.FC<I${name}Props> = (${withProps ? '{ title, description }' : 'props'}) => {
  return (
    <div className={styles.root}>
      {/* Conteúdo do componente ${name} */}${withProps ? `
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}` : ''}
    </div>
  );
};

export default ${name};
`,

  service: (name) => `import { getSP } from '../../config/pnpConfig';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/batching';

/**
 * ${name}
 * 
 * @description Serviço para operações relacionadas a ${name.replace('Service', '')}
 */
export class ${name} {
  private static sp = getSP();

  /**
   * Obtém todos os itens
   * @param listName Nome da lista do SharePoint
   * @param select Campos a serem retornados
   * @returns Promise com array de itens
   */
  public static async getAll<T = any>(
    listName: string,
    select: string[] = ['Id', 'Title']
  ): Promise<T[]> {
    try {
      const items = await this.sp.web.lists
        .getByTitle(listName)
        .items
        .select(...select)
        .top(5000)();
      
      return items as T[];
    } catch (error) {
      console.error(\`Erro ao buscar itens de \${listName}:\`, error);
      throw error;
    }
  }

  /**
   * Obtém um item por ID
   * @param listName Nome da lista do SharePoint
   * @param id ID do item
   * @param select Campos a serem retornados
   * @returns Promise com o item
   */
  public static async getById<T = any>(
    listName: string,
    id: number,
    select: string[] = ['Id', 'Title']
  ): Promise<T> {
    try {
      const item = await this.sp.web.lists
        .getByTitle(listName)
        .items
        .getById(id)
        .select(...select)();
      
      return item as T;
    } catch (error) {
      console.error(\`Erro ao buscar item \${id} de \${listName}:\`, error);
      throw error;
    }
  }

  /**
   * Cria um novo item
   * @param listName Nome da lista do SharePoint
   * @param data Dados do item a ser criado
   * @returns Promise com o item criado
   */
  public static async create<T = any>(
    listName: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      const result = await this.sp.web.lists
        .getByTitle(listName)
        .items
        .add(data);
      
      return result.data as T;
    } catch (error) {
      console.error(\`Erro ao criar item em \${listName}:\`, error);
      throw error;
    }
  }

  /**
   * Atualiza um item existente
   * @param listName Nome da lista do SharePoint
   * @param id ID do item
   * @param data Dados a serem atualizados
   * @returns Promise com o item atualizado
   */
  public static async update<T = any>(
    listName: string,
    id: number,
    data: Partial<T>
  ): Promise<T> {
    try {
      await this.sp.web.lists
        .getByTitle(listName)
        .items
        .getById(id)
        .update(data);
      
      return this.getById<T>(listName, id);
    } catch (error) {
      console.error(\`Erro ao atualizar item \${id} em \${listName}:\`, error);
      throw error;
    }
  }

  /**
   * Deleta um item
   * @param listName Nome da lista do SharePoint
   * @param id ID do item
   * @returns Promise void
   */
  public static async delete(
    listName: string,
    id: number
  ): Promise<void> {
    try {
      await this.sp.web.lists
        .getByTitle(listName)
        .items
        .getById(id)
        .delete();
    } catch (error) {
      console.error(\`Erro ao deletar item \${id} de \${listName}:\`, error);
      throw error;
    }
  }
}
`,

  hook: (name) => `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSP } from '../../config/pnpConfig';

/**
 * Hook customizado ${name}
 * 
 * @description Hook para gerenciar dados do SharePoint com cache
 */
export const ${name} = <T = any>(listName: string, select: string[] = ['Id', 'Title']) => {
  const sp = getSP();
  const queryClient = useQueryClient();

  // Query para buscar dados
  const {
    data: items,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['${name.replace('use', '').toLowerCase()}', listName],
    queryFn: async () => {
      const result = await sp.web.lists
        .getByTitle(listName)
        .items
        .select(...select)
        .top(5000)();
      return result as T[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para criar item
  const createMutation = useMutation({
    mutationFn: async (data: Partial<T>) => {
      const result = await sp.web.lists
        .getByTitle(listName)
        .items
        .add(data);
      return result.data as T;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${name.replace('use', '').toLowerCase()}', listName] });
    },
  });

  // Mutation para atualizar item
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<T> }) => {
      await sp.web.lists
        .getByTitle(listName)
        .items
        .getById(id)
        .update(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${name.replace('use', '').toLowerCase()}', listName] });
    },
  });

  // Mutation para deletar item
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await sp.web.lists
        .getByTitle(listName)
        .items
        .getById(id)
        .delete();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${name.replace('use', '').toLowerCase()}', listName] });
    },
  });

  return {
    items: items || [],
    loading,
    error: error ? String(error) : null,
    refetch,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
`,

  test: (name, type) => `import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ${name} from '../src/${type === 'page' ? 'webparts/app/pages' : type === 'component' ? 'webparts/app/components' : 'core/hooks'}/${name}';

describe('${name}', () => {
  it('deve renderizar sem erros', () => {
    ${type === 'page' || type === 'component' ? `render(<${name} />);
    expect(screen.getByText(/${name}/i)).toBeInTheDocument();` : `// Adicione seus testes aqui`}
  });

  // Adicione mais testes aqui
});
`,

  model: (name) => `/**
 * Interface ${name}
 * 
 * @description Model para ${name}
 */
export interface ${name} {
  Id: number;
  Title: string;
  Created?: Date;
  Modified?: Date;
  Author?: {
    Title: string;
    EMail: string;
  };
  Editor?: {
    Title: string;
    EMail: string;
  };
  
  // Adicione seus campos customizados aqui
}
`
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function toPascalCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
    .replace(/\s+/g, '')
    .replace(/-/g, '');
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log.success(`Diretório criado: ${dirPath}`);
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// ============================================
// GERADORES
// ============================================

async function generatePage(name, options = {}) {
  const pageName = toPascalCase(name);
  const routePath = options.route || `/${toKebabCase(name)}`;
  const withSharePoint = options.withSharePoint !== false;
  
  // Criar diretório se não existir
  const pagesDir = path.join(basePath, 'src', 'webparts', 'app', 'pages');
  ensureDir(pagesDir);
  
  // Caminho do arquivo
  const filePath = path.join(pagesDir, `${pageName}.tsx`);
  
  if (fileExists(filePath)) {
    log.error(`Página ${pageName} já existe!`);
    return false;
  }
  
  // Criar arquivo
  fs.writeFileSync(filePath, templates.page(pageName, withSharePoint));
  log.success(`Arquivo criado: src/webparts/app/pages/${pageName}.tsx`);
  
  // Adicionar rota ao App.tsx
  if (options.addRoute !== false) {
    addRouteToApp(pageName, routePath);
  }
  
  // Criar teste
  if (options.withTest !== false) {
    const testsDir = path.join(basePath, 'tests', 'pages');
    ensureDir(testsDir);
    const testPath = path.join(testsDir, `${pageName}.test.tsx`);
    fs.writeFileSync(testPath, templates.test(pageName, 'page'));
    log.success(`Teste criado: tests/pages/${pageName}.test.tsx`);
  }
  
  return { pageName, routePath, filePath };
}

async function generateComponent(name, options = {}) {
  const componentName = toPascalCase(name);
  const withProps = options.withProps !== false;
  
  // Criar diretório se não existir
  const componentsDir = path.join(basePath, 'src', 'webparts', 'app', 'components');
  ensureDir(componentsDir);
  
  // Caminho do arquivo
  const filePath = path.join(componentsDir, `${componentName}.tsx`);
  
  if (fileExists(filePath)) {
    log.error(`Componente ${componentName} já existe!`);
    return false;
  }
  
  // Criar arquivo
  fs.writeFileSync(filePath, templates.component(componentName, withProps));
  log.success(`Arquivo criado: src/webparts/app/components/${componentName}.tsx`);
  
  // Criar teste
  if (options.withTest !== false) {
    const testsDir = path.join(basePath, 'tests', 'components');
    ensureDir(testsDir);
    const testPath = path.join(testsDir, `${componentName}.test.tsx`);
    fs.writeFileSync(testPath, templates.test(componentName, 'component'));
    log.success(`Teste criado: tests/components/${componentName}.test.tsx`);
  }
  
  return { componentName, filePath };
}

async function generateService(name, options = {}) {
  const serviceName = toPascalCase(name);
  
  // Criar diretório se não existir
  const servicesDir = path.join(basePath, 'src', 'core', 'services');
  ensureDir(servicesDir);
  
  // Caminho do arquivo
  const filePath = path.join(servicesDir, `${serviceName}.ts`);
  
  if (fileExists(filePath)) {
    log.error(`Serviço ${serviceName} já existe!`);
    return false;
  }
  
  // Criar arquivo
  fs.writeFileSync(filePath, templates.service(serviceName));
  log.success(`Arquivo criado: src/core/services/${serviceName}.ts`);
  
  // Criar teste
  if (options.withTest !== false) {
    const testsDir = path.join(basePath, 'tests', 'services');
    ensureDir(testsDir);
    const testPath = path.join(testsDir, `${serviceName}.test.ts`);
    fs.writeFileSync(testPath, templates.test(serviceName, 'service'));
    log.success(`Teste criado: tests/services/${serviceName}.test.ts`);
  }
  
  return { serviceName, filePath };
}

async function generateHook(name, options = {}) {
  let hookName = name;
  if (!hookName.startsWith('use')) {
    hookName = 'use' + toPascalCase(hookName);
  } else {
    hookName = 'use' + toPascalCase(hookName.replace(/^use/i, ''));
  }
  
  // Criar diretório se não existir
  const hooksDir = path.join(basePath, 'src', 'core', 'hooks');
  ensureDir(hooksDir);
  
  // Caminho do arquivo
  const filePath = path.join(hooksDir, `${hookName}.ts`);
  
  if (fileExists(filePath)) {
    log.error(`Hook ${hookName} já existe!`);
    return false;
  }
  
  // Criar arquivo
  fs.writeFileSync(filePath, templates.hook(hookName));
  log.success(`Arquivo criado: src/core/hooks/${hookName}.ts`);
  
  // Criar teste
  if (options.withTest !== false) {
    const testsDir = path.join(basePath, 'tests', 'hooks');
    ensureDir(testsDir);
    const testPath = path.join(testsDir, `${hookName}.test.ts`);
    fs.writeFileSync(testPath, templates.test(hookName, 'hook'));
    log.success(`Teste criado: tests/hooks/${hookName}.test.ts`);
  }
  
  return { hookName, filePath };
}

async function generateModel(name, options = {}) {
  const modelName = 'I' + toPascalCase(name);
  
  // Criar diretório se não existir
  const modelsDir = path.join(basePath, 'src', 'models');
  ensureDir(modelsDir);
  
  // Caminho do arquivo
  const filePath = path.join(modelsDir, `${modelName}.ts`);
  
  if (fileExists(filePath)) {
    log.error(`Model ${modelName} já existe!`);
    return false;
  }
  
  // Criar arquivo
  fs.writeFileSync(filePath, templates.model(modelName));
  log.success(`Arquivo criado: src/models/${modelName}.ts`);
  
  return { modelName, filePath };
}

// ============================================
// ATUALIZAR APP.TSX COM ROTAS
// ============================================

function addRouteToApp(pageName, routePath) {
  const appPath = path.join(basePath, 'src', 'webparts', 'app', 'App.tsx');
  
  if (!fileExists(appPath)) {
    log.warn('App.tsx não encontrado. Rota não adicionada automaticamente.');
    return;
  }
  
  let content = fs.readFileSync(appPath, 'utf8');
  
  // Adicionar import
  const importStatement = `import ${pageName} from './pages/${pageName}';`;
  const importRegex = /import.*from ['"]\.\/pages\//g;
  const imports = content.match(importRegex);
  
  if (imports && imports.length > 0) {
    const lastImport = imports[imports.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport);
    const insertPosition = lastImportIndex + lastImport.length;
    content = content.slice(0, insertPosition) + '\n' + importStatement + content.slice(insertPosition);
  } else {
    // Adicionar após os outros imports
    const lastImportIndex = content.lastIndexOf('import');
    const nextLineIndex = content.indexOf('\n', lastImportIndex);
    content = content.slice(0, nextLineIndex + 1) + importStatement + '\n' + content.slice(nextLineIndex + 1);
  }
  
  // Adicionar rota antes do NotFound (Route path="*")
  const routeStatement = `          <Route path="${routePath}" element={<${pageName} />} />`;
  const notFoundIndex = content.indexOf('<Route path="*"');
  
  if (notFoundIndex !== -1) {
    content = content.slice(0, notFoundIndex) + routeStatement + '\n          ' + content.slice(notFoundIndex);
  } else {
    log.warn('Não foi possível adicionar a rota automaticamente. Adicione manualmente ao App.tsx');
    return;
  }
  
  fs.writeFileSync(appPath, content);
  log.success(`Rota adicionada ao App.tsx: ${routePath}`);
}

// ============================================
// MODO INTERATIVO
// ============================================

async function interactiveMode() {
  log.title('🎨 GERADOR INTERATIVO SPFx');
  
  console.log('Escolha o que deseja gerar:\n');
  console.log('  1. Página (Page)');
  console.log('  2. Componente (Component)');
  console.log('  3. Serviço (Service)');
  console.log('  4. Hook Customizado (Hook)');
  console.log('  5. Model/Interface (Model)');
  console.log('  0. Sair\n');
  
  const choice = await question('Digite o número da opção: ');
  
  switch (choice.trim()) {
    case '1': {
      const name = await question('\nNome da página (ex: Dashboard): ');
      if (!name) {
        log.error('Nome não pode ser vazio!');
        break;
      }
      
      const addRoute = await question('Adicionar rota automaticamente? (S/n): ');
      const routePath = addRoute.toLowerCase() !== 'n' 
        ? await question(`Caminho da rota (padrão: /${toKebabCase(name)}): `) || `/${toKebabCase(name)}`
        : null;
      
      const withSP = await question('Incluir exemplo com SharePoint? (S/n): ');
      
      const result = await generatePage(name, {
        addRoute: addRoute.toLowerCase() !== 'n',
        route: routePath,
        withSharePoint: withSP.toLowerCase() !== 'n'
      });
      
      if (result) {
        showSummary('Página', result);
      }
      break;
    }
    
    case '2': {
      const name = await question('\nNome do componente (ex: UserCard): ');
      if (!name) {
        log.error('Nome não pode ser vazio!');
        break;
      }
      
      const withProps = await question('Incluir props de exemplo? (S/n): ');
      
      const result = await generateComponent(name, {
        withProps: withProps.toLowerCase() !== 'n'
      });
      
      if (result) {
        showSummary('Componente', result);
      }
      break;
    }
    
    case '3': {
      const name = await question('\nNome do serviço (ex: UserService): ');
      if (!name) {
        log.error('Nome não pode ser vazio!');
        break;
      }
      
      const result = await generateService(name);
      
      if (result) {
        showSummary('Serviço', result);
      }
      break;
    }
    
    case '4': {
      const name = await question('\nNome do hook (ex: useUserData): ');
      if (!name) {
        log.error('Nome não pode ser vazio!');
        break;
      }
      
      const result = await generateHook(name);
      
      if (result) {
        showSummary('Hook', result);
      }
      break;
    }
    
    case '5': {
      const name = await question('\nNome do model (ex: User): ');
      if (!name) {
        log.error('Nome não pode ser vazio!');
        break;
      }
      
      const result = await generateModel(name);
      
      if (result) {
        showSummary('Model', result);
      }
      break;
    }
    
    case '0':
      log.info('Saindo...');
      break;
      
    default:
      log.error('Opção inválida!');
  }
  
  rl.close();
}

// ============================================
// MOSTRAR RESUMO
// ============================================

function showSummary(type, result) {
  console.log(`
${colors.cyan}┌─────────────────────────────────────────────────────┐
│           ✨ ${type} criado com sucesso!${' '.repeat(Math.max(0, 16 - type.length))}│
├─────────────────────────────────────────────────────┤${colors.reset}
│ ${colors.yellow}Arquivo:${colors.reset} ${result.filePath?.replace(basePath, '').replace(/\\/g, '/')}
${result.routePath ? `│ ${colors.yellow}Rota:${colors.reset}    ${result.routePath}` : ''}
${colors.cyan}└─────────────────────────────────────────────────────┘${colors.reset}

${colors.green}📝 Próximos passos:${colors.reset}
  1. Edite o arquivo criado
  2. ${result.routePath ? `Acesse http://localhost:4321/#${result.routePath}` : 'Importe e use em seus componentes'}
  3. Execute os testes: npm test
`);
}

// ============================================
// MAIN
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const name = args[1];
  
  if (!command) {
    await interactiveMode();
    return;
  }
  
  if (!name) {
    log.error('Nome é obrigatório!');
    log.info('Uso: npm run generate:page NomeDaPagina');
    process.exit(1);
  }
  
  let result;
  
  switch (command) {
    case 'page':
      result = await generatePage(name);
      if (result) showSummary('Página', result);
      break;
      
    case 'component':
      result = await generateComponent(name);
      if (result) showSummary('Componente', result);
      break;
      
    case 'service':
      result = await generateService(name);
      if (result) showSummary('Serviço', result);
      break;
      
    case 'hook':
      result = await generateHook(name);
      if (result) showSummary('Hook', result);
      break;
      
    case 'model':
      result = await generateModel(name);
      if (result) showSummary('Model', result);
      break;
      
    default:
      log.error(`Comando desconhecido: ${command}`);
      log.info('Comandos disponíveis: page, component, service, hook, model');
      process.exit(1);
  }
  
  rl.close();
}

main().catch((error) => {
  log.error(`Erro: ${error.message}`);
  rl.close();
  process.exit(1);
});

