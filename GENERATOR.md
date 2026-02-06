# 🎨 Gerador de Código SPFx

Aumente sua produtividade gerando código padronizado instantaneamente.

## 🚀 Como Usar

Recomendamos o **modo interativo**, que é inteligente e se adapta ao modo do seu projeto:

```bash
pnpm run generate
```

> 💡 **Nota:** O menu de opções muda automaticamente dependendo se você configurou o projeto como **Aplicação (SPA)** ou **Widget (WebPart)**.

### Comandos Diretos (Para Scripts/CI)

| O que você quer criar? | Comando | Exemplo |
|------------------------|---------|---------|
| **Página + Rota** | `pnpm run generate:page <Nome>` | `pnpm run generate:page Dashboard` |
| **Componente** | `pnpm run generate:component <Nome>` | `pnpm run generate:component Header` |
| **Serviço (CRUD)** | `pnpm run generate:service <Nome>` | `pnpm run generate:service Projetos` |
| **Hook Customizado** | `pnpm run generate:hook <Nome>` | `pnpm run generate:hook Permissoes` |
| **Interface (Model)** | `pnpm run generate:model <Nome>` | `pnpm run generate:model Projeto` |

> ⚠️ **Nota importante para serviços:** Ao criar um serviço, informe apenas o nome base (sem o sufixo "Service"). O gerador adicionará automaticamente o sufixo. Por exemplo, use `pnpm run generate:service Projetos` para criar `ProjetosService.ts`.
>
> ⚠️ **Nota importante para hooks:** Ao criar um hook, informe apenas o nome base (sem o prefixo "use"). O gerador adicionará automaticamente o prefixo. Por exemplo, use `pnpm run generate:hook Permissoes` para criar `usePermissoes.ts`.

---

## 🧠 Modos de Operação

O gerador respeita a arquitetura definida no `configure`.

### 1. Modo Página (SPA)
Se seu projeto é uma Aplicação de Tela Cheia (com roteamento):
*   Você verá a opção **"Página (Page)"**.
*   Ao criar uma página, ela é automaticamente conectada ao Router (`App.tsx`) e Menu (`navigation.ts`).
*   Suporta geração automática de **CRUD Completo** (Model + Service + Hook + UI).

### 2. Modo Componente (Widget)
Se seu projeto é um Widget isolado (WebPart):
*   A opção **"Página (Page)"** fica **oculta** (pois Widgets não têm roteamento interno).
*   **Fluxo Recomendado para Widgets Inteligentes:**
1.  Gere o **Serviço** (`generate:service Noticias`) para a lógica de dados (o sufixo "Service" é adicionado automaticamente).
2.  Gere o **Hook** (`generate:hook Noticias`) para gerenciar o estado (o prefixo "use" é adicionado automaticamente).
3.  Gere o **Componente** (`generate:component NoticiasWidget`) para a interface.
4.  Conecte manualmente importando o hook no componente.
5.  Adicione o componente no `MainWidget.tsx`.

---

## 📦 O Que é Gerado?

### 1. Página (`generate:page`)
*(Apenas Modo SPA)*
Cria uma nova tela e configura o roteamento automaticamente.
*   **Arquivo:** `src/webparts/app/pages/Dashboard.tsx`
*   **Rota:** Adiciona `<Route path="/dashboard" ... />` em `App.tsx`
*   **Teste:** `tests/pages/Dashboard.test.tsx`

### 2. Componente (`generate:component`)
Componente React funcional limpo e tipado.
*   **Arquivo:** `src/webparts/app/components/Header.tsx`
*   **Teste:** `tests/components/Header.test.tsx`
*   **Uso:** Ideal para pedaços de UI reutilizáveis ou Widgets autônomos.

### 3. Serviço (`generate:service`)
Classe estática com métodos CRUD prontos para SharePoint.
*   **Arquivo:** `src/core/services/ProjetosService.ts` (o sufixo "Service" é adicionado automaticamente)
*   **Métodos:** `getAll`, `getById`, `create`, `update`, `delete`
*   **Segurança:** Inclui validação automática (`ensureListExists`) em desenvolvimento.

### 4. Hook (`generate:hook`)
Hook React para encapsular lógica de estado ou efeitos.
*   **Arquivo:** `src/core/hooks/usePermissoes.ts` (o prefixo "use" é adicionado automaticamente)
*   **Estrutura:** Já vem com estados de `data`, `loading` e `error`.

### 5. Model (`generate:model`)
Interface TypeScript com campos padrão do SharePoint.
*   **Arquivo:** `src/models/IProjeto.ts`
*   **Campos Padrão:** `Id`, `Title`, `Created`, `Author`, etc.

---

## ⚡ Conexão com Listas SharePoint (Modo SPA)

O gerador possui uma inteligência de orquestração para páginas.

**O Fluxo Automatizado:**
1. Rode `pnpm run generate` e escolha **Página**.
2. Responda **SIM** para "Deseja conectar essa página a uma lista SharePoint?".
3. Informe o nome da lista e escolha o **Nível de Integração**:

*   **Apenas Leitura:** Tabela com busca e filtros (sem botões de edição).
*   **CRUD Completo:** Tabela + Formulários + Botões de Ação + Dialog de Confirmação.

**Resultado:** 4 arquivos conectados (`Model` -> `Service` -> `Hook` -> `Page`) prontos para uso.

---

## ⚠️ Importante: Marcadores de Código

O gerador utiliza comentários especiais (marcadores) para injetar código de forma segura nos arquivos `App.tsx` e `navigation.ts`.

**Não remova estes comentários:**
*   `/* GENERATOR: IMPORT_PAGE */`
*   `{/* GENERATOR: ROUTE_PAGE */}`
*   `/* GENERATOR: IMPORT_ICON */`
*   `/* GENERATOR: NAV_ITEM */`

Se removidos, o gerador não conseguirá injetar rotas automaticamente.

---

## 💡 Padronização Automática

O gerador ajusta automaticamente o nome dos arquivos para seguir as boas práticas:

| Se você digitar... | O gerador cria... | Tipo |
|--------------------|-------------------|------|
| `minha pagina` | `MinhaPagina.tsx` | Página |
| `header-top` | `HeaderTop.tsx` | Componente |
| `projetos` | `ProjetosService.ts` | Serviço (sufixo "Service" adicionado automaticamente) |
| `permissoes` | `usePermissoes.ts` | Hook (prefixo "use" adicionado automaticamente) |
| `projeto` | `IProjeto.ts` | Model |
