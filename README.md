# 🚀 SPFx Template

Template pré-configurado para desenvolvimento rápido de aplicações SharePoint SPFx.

> 📖 **Primeira vez?** Veja [SETUP.md](./SETUP.md) para configuração inicial.

## 📋 Stack do Template

| Tecnologia | Versão | Observação |
|------------|--------|------------|
| SPFx | 1.21.0 | Framework base |
| React | 17.0.1 | Versão do SPFx |
| Node.js | 18.x LTS | Recomendado (ver .nvmrc) |
| Fluent UI | v8 | UI padrão SharePoint |
| PnPjs | 4.x | API SharePoint |
| React Router | v6 | **HashRouter obrigatório** |
| TanStack Query | v4 | Cache de dados |
| TypeScript | 4.8 | Tipagem |

## 📁 Estrutura do Projeto

```
├── app.config.json           # 🔧 CONFIGURE TUDO AQUI!
├── scripts/
│   └── generate.js           # Gerador de código CLI
├── config/                   # Configurações do SPFx
├── fast-serve/               # Configuração do fast-serve
├── sharepoint/               # Assets do SharePoint
├── src/
│   ├── @types/               # Declarações de tipos
│   ├── config/               # Configurações (PnP, Graph, etc)
│   │   └── pnpConfig.ts      # Configuração do PnPjs
│   ├── core/                 # Lógica de negócio
│   │   ├── helpers/          # Funções utilitárias
│   │   ├── hooks/            # React Hooks customizados
│   │   └── services/         # Serviços (SharePoint, API, etc)
│   ├── models/               # Interfaces e tipos
│   └── webparts/
│       └── app/              # WebPart principal
│           ├── App.tsx       # Componente raiz
│           ├── AppWebPart.ts # Classe da WebPart
│           ├── components/   # Componentes React
│           ├── pages/        # Páginas da aplicação
│           ├── shared/       # Recursos compartilhados
│           │   └── css/      # Estilos globais
│           └── loc/          # Localização
├── teams/                    # Configuração do Teams
└── tests/                    # Testes unitários
    └── __mocks__/            # Mocks de SPFx para testes
```

---

## 📐 Stack de UI - Regras de Governança

> ⚠️ **IMPORTANTE:** Seguir estas regras garante consistência e manutenibilidade.

### ✅ **USE: Fluent UI v8 (Padrão)**

```typescript
// Componentes visuais - SEMPRE usar Fluent UI v8
import { PrimaryButton, TextField, Dialog, Text } from '@fluentui/react';
import { mergeStyleSets, getTheme } from '@fluentui/react';

const theme = getTheme();
const styles = mergeStyleSets({
  container: {
    padding: theme.spacing.l1,
    backgroundColor: theme.palette.neutralLight,
  },
});
```

**Quando usar:**
- Botões, inputs, selects, tabelas
- Layouts e containers
- Todos os componentes visuais

### ⚠️ **EXCEÇÃO: Radix UI (Headless) - Uso Restrito**

> ❗ **Radix é EXCEÇÃO, não padrão.** Use apenas quando Fluent UI não atender.

```typescript
// SOMENTE para casos específicos não cobertos pelo Fluent
import * as Toast from '@radix-ui/react-toast';
import * as Tooltip from '@radix-ui/react-tooltip';
```

**✅ Permitido (apenas estes 3 casos):**
- Toast/notifications customizadas
- Tooltips avançados
- Dropdowns muito customizados

**❌ PROIBIDO usar Radix para:**
- Layouts e containers
- Formulários (inputs, selects, checkboxes)
- Navegação e menus
- Modals e Dialogs (use Fluent `Dialog`)
- Qualquer coisa que Fluent já resolve

**⚠️ Por quê essa restrição em SPFx?**

| Problema | Impacto |
|----------|---------|
| **Portais DOM** | Radix usa `Portal` que pode escapar do container SPFx |
| **Focus Trap** | SharePoint já tem focus trap, Radix cria outro → conflito |
| **Acessibilidade** | Fluent já resolve ARIA, Radix duplica → redundância |
| **iFrames/Teams** | Componentes podem renderizar fora do contexto esperado |

---

### 🔀 **React Router DOM em SPFx - OBRIGATÓRIO HashRouter**

> ❗ **SEMPRE usar `HashRouter`.** NUNCA usar `BrowserRouter` em SPFx.

```typescript
// ✅ CORRETO - Usar sempre HashRouter
import { HashRouter as Router } from 'react-router-dom';

<HashRouter>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</HashRouter>
```

```typescript
// ❌ ERRADO - NUNCA usar BrowserRouter em SPFx
import { BrowserRouter } from 'react-router-dom'; // NÃO!
```

**⚠️ Por quê essa restrição?**

| Problema com BrowserRouter | Consequência |
|---------------------------|--------------|
| **Refresh da página** | SharePoint retorna 404 (não encontra a rota) |
| **Deep links** | URLs compartilhadas não funcionam |
| **History API** | Conflita com navegação nativa do SharePoint |
| **Deploy em subpastas** | Rotas quebram dependendo do site |

**Como funciona o HashRouter:**
- URL: `https://tenant.sharepoint.com/sites/app#/dashboard`
- O `#` indica ao SharePoint que tudo após é client-side
- Refresh e deep links funcionam corretamente

---

### 📦 **TanStack Query v4 - Limitações no React 17**

> ⚠️ **Use como DATA CACHE, não como state manager geral.**

TanStack Query funciona no React 17, mas **sem os recursos do React 18**:

| Recurso | React 18 | React 17 (SPFx) |
|---------|----------|-----------------|
| Concurrent rendering | ✅ | ❌ Não disponível |
| Automatic batching | ✅ Moderno | ⚠️ Limitado |
| Suspense para data | ✅ | ⚠️ Experimental |
| Cache efficiency | ✅ Otimizado | ⚠️ Menos eficiente |

**✅ Use TanStack Query para:**
- Cache de chamadas API/SharePoint
- Retry automático em falhas
- Stale-while-revalidate
- Invalidação de cache

**❌ NÃO use como substituto de:**
- Estado local de componente (`useState`)
- Estado global complexo (considere Context ou Zustand)
- Formulários (use React Hook Form)

```typescript
// ✅ Uso correto - cache de dados do SharePoint
const { data, isLoading } = useQuery({
  queryKey: ['listItems', listName],
  queryFn: () => sp.web.lists.getByTitle(listName).items(),
  staleTime: 5 * 60 * 1000, // 5 minutos
});
```

---

## 🔧 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run serve` | Inicia o servidor de desenvolvimento com fast-serve |
| `npm run build` | Compila o projeto |
| `npm test` | Executa os testes |
| `npm run generate` | 🎨 Gerador interativo de código |
| `npm run generate:page` | Gera uma nova página |
| `npm run generate:component` | Gera um novo componente |
| `npm run generate:service` | Gera um novo serviço |
| `npm run generate:hook` | Gera um novo hook customizado |

---

## 📦 Deploy para Produção

### 1. Build de produção
```bash
npm run build:prod
```

### 2. Faça upload do pacote
O arquivo `.sppkg` estará em `sharepoint/solution/`

Upload para o App Catalog do SharePoint:
1. Acesse o App Catalog do seu tenant
2. Faça upload do arquivo `.sppkg`
3. Confie no pacote
4. Adicione o app ao site desejado

## 🔐 Usando o PnPjs

O PnPjs já está configurado. Use assim:

```typescript
import { getSP } from '../../config/pnpConfig';

// Obter itens de uma lista
const sp = getSP();
const items = await sp.web.lists.getByTitle('MinhaLista').items();

// Criar item
await sp.web.lists.getByTitle('MinhaLista').items.add({
  Title: 'Novo Item'
});
```

## 🪝 Hooks Disponíveis

### useCurrentUser
```typescript
import { useCurrentUser } from '../../core/hooks/useSharePoint';

const MyComponent = () => {
  const { user, loading, error } = useCurrentUser();
  
  if (loading) return <div>Carregando...</div>;
  return <div>Olá, {user?.Title}</div>;
};
```

### useListItems
```typescript
import { useListItems } from '../../core/hooks/useSharePoint';

const MyComponent = () => {
  const { items, loading, refetch } = useListItems<IMyItem>(
    'MinhaLista',
    ['Id', 'Title', 'Status'],
    "Status eq 'Ativo'"
  );
  
  return (
    <ul>
      {items.map(item => <li key={item.Id}>{item.Title}</li>)}
    </ul>
  );
};
```

## 🎨 Gerador de Código

Crie páginas, componentes, serviços e hooks automaticamente!

### Modo Interativo
```bash
npm run generate
```

### Comandos Diretos
```bash
# Criar uma página (adiciona rota automaticamente!)
npm run generate:page Dashboard

# Criar um componente
npm run generate:component UserCard

# Criar um serviço com CRUD completo
npm run generate:service UserService

# Criar um hook customizado
npm run generate:hook useUserData
```

**O que é criado:**

- ✅ Arquivo com template completo
- ✅ Imports e configurações automáticas
- ✅ Rotas adicionadas ao App.tsx (páginas)
- ✅ Arquivo de teste
- ✅ TypeScript tipado
- ✅ Integração com PnPjs e SharePoint

📖 **[Ver documentação completa do gerador →](./GENERATOR.md)**

---

##  Licença

MIT
