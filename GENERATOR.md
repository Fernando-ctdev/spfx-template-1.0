# 🎨 Gerador de Código SPFx

Gerador CLI para criar páginas, componentes, serviços e hooks automaticamente no seu projeto SPFx.

## 🚀 Como Usar

### Modo Interativo (Recomendado)

```bash
npm run generate
```

Responda as perguntas e o gerador criará tudo automaticamente!

### Comandos Diretos

```bash
# Criar uma página
npm run generate:page Dashboard

# Criar um componente
npm run generate:component UserCard

# Criar um serviço
npm run generate:service UserService

# Criar um hook customizado
npm run generate:hook useUserData

# Criar um model/interface
npm run generate:model User
```

---

## 📦 O Que é Criado

### 🔷 Página (`generate:page`)

**Cria:**
- ✅ `src/webparts/app/pages/NomeDaPagina.tsx`
- ✅ `tests/pages/NomeDaPagina.test.tsx`
- ✅ Adiciona rota automaticamente no `App.tsx`

**Template inclui:**
- Estrutura básica com Material UI
- Exemplo de uso de hooks do SharePoint (opcional)
- Estados de loading e error
- TypeScript tipado

**Exemplo de uso:**
```bash
npm run generate:page Dashboard
# Cria: Dashboard.tsx
# Rota: /dashboard
# Acesse: http://localhost:4321/#/dashboard
```

---

### 🔷 Componente (`generate:component`)

**Cria:**
- ✅ `src/webparts/app/components/NomeDoComponente.tsx`
- ✅ `tests/components/NomeDoComponente.test.tsx`

**Template inclui:**
- Interface de Props
- Componente funcional React
- Material UI integrado
- JSDoc comentários
- TypeScript tipado

**Exemplo de uso:**
```bash
npm run generate:component UserCard
# Cria: UserCard.tsx
# Import: import UserCard from '../components/UserCard';
```

---

### 🔷 Serviço (`generate:service`)

**Cria:**
- ✅ `src/core/services/NomeDoServico.ts`
- ✅ `tests/services/NomeDoServico.test.ts`

**Template inclui:**
- Classe de serviço completa
- Métodos CRUD (getAll, getById, create, update, delete)
- Integração com PnPjs
- Tratamento de erros
- TypeScript tipado

**Exemplo de uso:**
```bash
npm run generate:service UserService
# Cria: UserService.ts
# Import: import { UserService } from '../../core/services/UserService';

// Usar:
const users = await UserService.getAll('Users', ['Id', 'Title', 'Email']);
```

---

### 🔷 Hook (`generate:hook`)

**Cria:**
- ✅ `src/core/hooks/useNomeDoHook.ts`
- ✅ `tests/hooks/useNomeDoHook.test.ts`

**Template inclui:**
- Hook customizado com TanStack Query
- Cache automático de dados
- Mutations (create, update, delete)
- Estados de loading
- TypeScript tipado

**Exemplo de uso:**
```bash
npm run generate:hook useUserData
# Cria: useUserData.ts
# Import: import { useUserData } from '../../core/hooks/useUserData';

// Usar:
const { items, loading, create, update, delete } = useUserData('Users');
```

---

### 🔷 Model (`generate:model`)

**Cria:**
- ✅ `src/models/INomeDoModel.ts`

**Template inclui:**
- Interface TypeScript
- Campos padrão do SharePoint (Id, Title, Created, Modified, Author, Editor)
- Espaço para campos customizados

**Exemplo de uso:**
```bash
npm run generate:model User
# Cria: IUser.ts
# Import: import { IUser } from '../../models/IUser';
```

---

## 🎯 Exemplos Práticos

### Criar uma página de Dashboard completa

```bash
npm run generate:page Dashboard
```

**Resultado:**
```
✔ Arquivo criado: src/webparts/app/pages/Dashboard.tsx
✔ Rota adicionada ao App.tsx: /dashboard
✔ Teste criado: tests/pages/Dashboard.test.tsx

┌─────────────────────────────────────────────────────┐
│           ✨ Página criada com sucesso!             │
├─────────────────────────────────────────────────────┤
│ Arquivo: src/webparts/app/pages/Dashboard.tsx      │
│ Rota:    /dashboard                                 │
└─────────────────────────────────────────────────────┘

📝 Próximos passos:
  1. Edite o arquivo Dashboard.tsx
  2. Acesse http://localhost:4321/#/dashboard
  3. Execute os testes: npm test
```

### Criar um componente reutilizável

```bash
npm run generate:component UserCard
```

Depois use em qualquer página:
```typescript
import UserCard from '../components/UserCard';

<UserCard title="João Silva" description="Desenvolvedor" />
```

### Criar um serviço para gerenciar usuários

```bash
npm run generate:service UserService
```

Use em qualquer lugar:
```typescript
import { UserService } from '../../core/services/UserService';

// Buscar todos
const users = await UserService.getAll('Users');

// Criar novo
const newUser = await UserService.create('Users', {
  Title: 'João Silva',
  Email: 'joao@empresa.com'
});

// Atualizar
await UserService.update('Users', 1, { Title: 'João Silva Jr.' });

// Deletar
await UserService.delete('Users', 1);
```

### Criar um hook com cache

```bash
npm run generate:hook useUsers
```

Use em componentes:
```typescript
import { useUsers } from '../../core/hooks/useUsers';

const MyComponent = () => {
  const { items, loading, error, create, update, delete } = useUsers('Users');
  
  if (loading) return <CircularProgress />;
  
  return (
    <div>
      {items.map(user => (
        <div key={user.Id}>{user.Title}</div>
      ))}
    </div>
  );
};
```

---

## 💡 Dicas

### ✅ Nomes em PascalCase
O gerador converte automaticamente para PascalCase:
```bash
npm run generate:page my-dashboard  # → MyDashboard.tsx
npm run generate:component user card # → UserCard.tsx
```

### ✅ Hooks sempre começam com "use"
```bash
npm run generate:hook userData     # → useUserData.ts
npm run generate:hook useUserData  # → useUserData.ts (mesmo resultado)
```

### ✅ Serviços terminam com "Service"
```bash
npm run generate:service User      # → UserService.ts
npm run generate:service UserService # → UserService.ts (mesmo resultado)
```

### ✅ Models começam com "I"
```bash
npm run generate:model User        # → IUser.ts
npm run generate:model IUser       # → IUser.ts (mesmo resultado)
```

---

## 🔧 Estrutura Criada

Após usar o gerador, seu projeto terá:

```
src/
├── webparts/
│   └── app/
│       ├── pages/           ← Páginas geradas aqui
│       │   ├── Dashboard.tsx
│       │   └── Users.tsx
│       ├── components/      ← Componentes gerados aqui
│       │   ├── UserCard.tsx
│       │   └── Header.tsx
│       └── App.tsx         ← Rotas adicionadas automaticamente
├── core/
│   ├── services/           ← Serviços gerados aqui
│   │   ├── UserService.ts
│   │   └── TaskService.ts
│   └── hooks/              ← Hooks gerados aqui
│       ├── useUsers.ts
│       └── useTasks.ts
└── models/                 ← Models gerados aqui
    ├── IUser.ts
    └── ITask.ts

tests/
├── pages/                  ← Testes de páginas
├── components/             ← Testes de componentes
├── services/               ← Testes de serviços
└── hooks/                  ← Testes de hooks
```

---

## ❓ FAQ

**Q: Posso editar os arquivos gerados?**  
A: Sim! Os arquivos são templates iniciais. Edite livremente.

**Q: E se o arquivo já existir?**  
A: O gerador não sobrescreve. Mostra um erro e você pode escolher outro nome.

**Q: As rotas são adicionadas automaticamente?**  
A: Sim! Para páginas, a rota é adicionada ao `App.tsx` automaticamente.

**Q: Posso customizar os templates?**  
A: Sim! Edite o arquivo `scripts/generate.js` e modifique as funções de template.

**Q: Os testes são criados automaticamente?**  
A: Sim! Um arquivo de teste básico é criado para cada item gerado.

---

## 🎉 Pronto!

Agora você pode criar páginas, componentes, serviços e hooks em segundos!

```bash
npm run generate
```

**Happy coding! 🚀**

