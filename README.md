# 🚀 SPFx Template

Template pré-configurado para desenvolvimento rápido de aplicações SharePoint SPFx.

📖 **Primeira vez usando o template?** Consulte o arquivo [SETUP.md](./SETUP.md) para instruções de configuração inicial.

## 📋 Características

- ✅ SPFx 1.21.0 com React 17
- ✅ Node.js 18.17.1+ ou 20.x LTS (compatível com SPFx 1.21.0)
- ✅ Fast-serve para desenvolvimento rápido (reload acelerado)
- ✅ PnPjs 4.x para operações com SharePoint
- ✅ **Fluent UI v8** para componentes visuais (padrão SharePoint)
- ✅ **Radix UI** para componentes headless avançados
- ✅ React Router DOM para navegação SPA com sync de URL
- ✅ React Hook Form + Zod para formulários
- ✅ TanStack Query para cache e sincronização de dados
- ✅ TypeScript configurado para SPFx
- ✅ Jest + Testing Library para testes unitários
- ✅ Mocks de SPFx incluídos para testes
- ✅ Suporte a Teams, Office e Outlook (via SPFx)
- ✅ CSS escopado com `.spfx-app-root` (seguro para updates)
- ✅ 🎨 Gerador CLI de páginas, componentes, serviços e hooks

## 🔧 Versão do Node.js

- **Node.js 18.17.1+ ou 20.x LTS** (recomendado)
- NVM recomendado para gerenciar versões
- SharePoint Framework (SPFx) 1.21.0
- React 17

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

### ✅ **USE: Radix UI (Headless)**

```typescript
// Apenas para comportamentos avançados não disponíveis no Fluent
import * as Toast from '@radix-ui/react-toast';
import * as Tooltip from '@radix-ui/react-tooltip';
```

**Quando usar:**
- Toast/notifications customizadas
- Tooltips avançados
- Componentes que precisam de controle total de estilo

### ❌ **NÃO USE: MUI (Material UI) ou Fluent UI v9**

MUI e Fluent UI v9 foram **removidos** do template para evitar:
- Conflitos de CSS com SharePoint
- Incompatibilidade com React 17 (v9 requer React 18)
- Bundle desnecessariamente grande
- Inconsistência visual

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

## 🎯 Modos de Aplicação

O template suporta **dois modos** de desenvolvimento, configurados automaticamente no `app.config.json`:

### 🖥️ **Modo Full Page (`"mode": "fullpage"`)**

**Para aplicações que ocupam a página inteira:**

- ✅ Oculta automaticamente header e navegação do SharePoint
- ✅ Controle total da interface do usuário
- ✅ Ideal para portais, dashboards e aplicações completas
- ✅ React Router para navegação SPA

**Quando usar:**
- Portais corporativos
- Dashboards executivos
- Aplicações que precisam de UX customizada
- Sistemas completos (CRM, ERP, etc)

### 🧩 **Modo WebPart (`"mode": "webpart"`)**

**Para componentes que convivem com o SharePoint:**

- ✅ Mantém header e navegação do SharePoint visíveis
- ✅ Pode ser inserido em qualquer página
- ✅ Convive com outros WebParts
- ✅ Múltiplas instâncias na mesma página

**Quando usar:**
- Widgets e componentes reutilizáveis
- Gráficos e visualizações de dados
- Formulários específicos
- Integrações pontuais

### 🔄 **Trocar de Modo**

Para mudar o modo da aplicação:

1. Edite o `app.config.json`:
```json
{
  "mode": "webpart"  // ou "fullpage"
}
```

2. Execute:
```bash
npm run configure
```

Pronto! O template será reconfigurado automaticamente.

📖 **[Ver guia completo de modos →](./MODES.md)**

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

## 📝 Criando Páginas Manualmente

Se preferir criar manualmente:

1. Crie o componente em `src/webparts/app/pages/`
2. Adicione a rota em `src/webparts/app/App.tsx`:

```typescript
import MinhaNovaPage from './pages/MinhaNovaPage';

// No componente Routes:
<Route path="/minha-nova-pagina" element={<MinhaNovaPage />} />
```

## 📄 Licença

MIT
