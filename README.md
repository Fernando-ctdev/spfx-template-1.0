# 🚀 SPFx Full Page Template

Template pré-configurado para desenvolvimento rápido de aplicações SharePoint SPFx de **página inteira**.

## 📋 Características

- ✅ SPFx 1.20+ com React 17
- ✅ Fast-serve para desenvolvimento rápido (hot reload)
- ✅ PnPjs 4.x para operações com SharePoint
- ✅ Material UI (MUI) 6.x para componentes
- ✅ Radix UI para componentes acessíveis
- ✅ React Router DOM para navegação SPA
- ✅ React Hook Form + Zod para formulários
- ✅ TanStack Query para cache de dados
- ✅ TypeScript configurado
- ✅ Jest para testes
- ✅ Suporte a Teams, Office e Outlook
- ✅ CSS Global que esconde elementos nativos do SharePoint
- ✅ **Configuração centralizada em um único arquivo!**

## 🛠️ Instalação (Super Simples!)

### 1. Clone ou copie o template

```bash
cp -r spfx-template-fullpage meu-novo-projeto
cd meu-novo-projeto
```

### 2. Configure TUDO em um único arquivo! 📝

Edite apenas o arquivo `app.config.json` na raiz do projeto:

```json
{
  "tenant": "contoso",
  "siteUrl": "/sites/meusite",
  "appName": "my-spfx-app",
  "appTitle": "My App"
}
```

**Só isso!** 4 campos:

| Campo | O que é | Exemplo |
|-------|---------|---------|
| `tenant` | Nome do seu tenant (sem .sharepoint.com) | `contoso` |
| `siteUrl` | Caminho do site | `/sites/meusite` |
| `appName` | Nome técnico do app (sem espaços) | `portal-rh` |
| `appTitle` | Nome que aparece no SharePoint | `Portal RH` |

> 💡 Os GUIDs são gerados automaticamente na primeira execução!

### 3. Instale as dependências

```bash
npm install
```

O script `postinstall` vai automaticamente:
- ✅ Ler o `app.config.json`
- ✅ Atualizar `config/package-solution.json`
- ✅ Atualizar `fast-serve/config.json`
- ✅ Atualizar `config/serve.json`
- ✅ Atualizar `src/webparts/app/AppWebPart.manifest.json`

### 4. Execute em modo de desenvolvimento

```bash
npm run serve
```

**Pronto!** 🎉 O navegador abrirá automaticamente no seu site SharePoint.

## 📁 Estrutura do Projeto

```
├── app.config.json           # 🔧 CONFIGURE TUDO AQUI!
├── scripts/
│   └── configure.js          # Script de configuração automática
├── config/                   # Configurações do SPFx (auto-gerado)
├── fast-serve/               # Configuração do fast-serve (auto-gerado)
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
```

## 🔧 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run configure` | Aplica as configurações do app.config.json |
| `npm run serve` | Inicia o servidor de desenvolvimento com fast-serve |
| `npm run build` | Compila o projeto |
| `npm test` | Executa os testes |

> 💡 O script `configure` roda automaticamente após `npm install`

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

## 📝 Criando Novas Páginas

1. Crie o componente em `src/webparts/app/pages/`
2. Adicione a rota em `src/webparts/app/App.tsx`:

```typescript
import MinhaNovaPage from './pages/MinhaNovaPage';

// No componente Routes:
<Route path="/minha-nova-pagina" element={<MinhaNovaPage />} />
```

## 📄 Licença

MIT
