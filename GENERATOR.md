# 🎨 Gerador de Código

CLI para criar páginas, componentes, serviços e hooks automaticamente.

## 🚀 Uso Rápido

```bash
npm run generate          # Modo interativo (recomendado)
```

### Comandos Diretos

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `npm run generate:page` | Cria página + rota | `npm run generate:page Dashboard` |
| `npm run generate:component` | Cria componente | `npm run generate:component UserCard` |
| `npm run generate:service` | Cria serviço CRUD | `npm run generate:service UserService` |
| `npm run generate:hook` | Cria hook customizado | `npm run generate:hook useUserData` |
| `npm run generate:model` | Cria interface | `npm run generate:model User` |

---

## 📦 O Que é Criado

### Página (`generate:page`)

```bash
npm run generate:page Dashboard
```

| Arquivo | Caminho |
|---------|---------|
| Página | `src/webparts/app/pages/Dashboard.tsx` |
| Teste | `tests/pages/Dashboard.test.tsx` |
| Rota | Adicionada automaticamente no `App.tsx` |

**Acesse:** `http://localhost:4321/#/dashboard`

---

### Componente (`generate:component`)

```bash
npm run generate:component UserCard
```

| Arquivo | Caminho |
|---------|---------|
| Componente | `src/webparts/app/components/UserCard.tsx` |
| Teste | `tests/components/UserCard.test.tsx` |

```typescript
import UserCard from '../components/UserCard';

<UserCard title="João Silva" description="Desenvolvedor" />
```

---

### Serviço (`generate:service`)

```bash
npm run generate:service UserService
```

| Arquivo | Caminho |
|---------|---------|
| Serviço | `src/core/services/UserService.ts` |
| Teste | `tests/services/UserService.test.ts` |

**Métodos inclusos:** `getAll`, `getById`, `create`, `update`, `delete`

```typescript
import { UserService } from '../../core/services/UserService';

const users = await UserService.getAll('Users');
await UserService.create('Users', { Title: 'João' });
await UserService.update('Users', 1, { Title: 'João Jr.' });
await UserService.delete('Users', 1);
```

---

### Hook (`generate:hook`)

```bash
npm run generate:hook useUsers
```

| Arquivo | Caminho |
|---------|---------|
| Hook | `src/core/hooks/useUsers.ts` |
| Teste | `tests/hooks/useUsers.test.ts` |

```typescript
import { useUsers } from '../../core/hooks/useUsers';

const { items, loading, create, update, remove } = useUsers('Users');
```

---

### Model (`generate:model`)

```bash
npm run generate:model User
```

| Arquivo | Caminho |
|---------|---------|
| Interface | `src/models/IUser.ts` |

Inclui campos padrão SharePoint: `Id`, `Title`, `Created`, `Modified`, `Author`, `Editor`

---

## 💡 Convenções de Nomes

O gerador normaliza automaticamente:

| Tipo | Input | Output |
|------|-------|--------|
| Página | `my-dashboard` | `MyDashboard.tsx` |
| Componente | `user card` | `UserCard.tsx` |
| Hook | `userData` | `useUserData.ts` |
| Serviço | `User` | `UserService.ts` |
| Model | `User` | `IUser.ts` |

---

## 📁 Estrutura Gerada

```
src/
├── webparts/app/
│   ├── pages/          ← Páginas
│   ├── components/     ← Componentes
│   └── App.tsx         ← Rotas (auto)
├── core/
│   ├── services/       ← Serviços
│   └── hooks/          ← Hooks
└── models/             ← Interfaces

tests/
├── pages/
├── components/
├── services/
└── hooks/
```

---

## ❓ FAQ

| Pergunta | Resposta |
|----------|----------|
| Posso editar os arquivos? | Sim, são templates iniciais |
| E se o arquivo existir? | Erro + escolha outro nome |
| Rotas são automáticas? | Sim, para páginas |
| Posso customizar templates? | Sim, edite `scripts/generate.js` |

---

```bash
npm run generate
```

**Happy coding! 🚀**

