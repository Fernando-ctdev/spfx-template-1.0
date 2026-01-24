# 🎨 Gerador de Código SPFx

Aumente sua produtividade gerando código padronizado instantaneamente.

## 🚀 Como Usar

Recomendamos o **modo interativo**, que guia você pelas opções:

```bash
pnpm run generate
```

### Comandos Diretos (Para Scripts/CI)

| O que você quer criar? | Comando | Exemplo |
|------------------------|---------|---------|
| **Página + Rota** | `pnpm run generate:page <Nome>` | `pnpm run generate:page Dashboard` |
| **Componente** | `pnpm run generate:component <Nome>` | `pnpm run generate:component Header` |
| **Serviço (CRUD)** | `pnpm run generate:service <Nome>` | `pnpm run generate:service Projetos` |
| **Hook Customizado** | `pnpm run generate:hook <Nome>` | `pnpm run generate:hook usePermissoes` |
| **Interface (Model)** | `pnpm run generate:model <Nome>` | `pnpm run generate:model Projeto` |

---

## 📦 O Que é Gerado?

### 1. Página (`generate:page`)
Cria uma nova tela e configura o roteamento automaticamente.
*   **Arquivo:** `src/webparts/app/pages/Dashboard.tsx`
*   **Rota:** Adiciona `<Route path="/dashboard" ... />` em `App.tsx`
*   **Teste:** `tests/pages/Dashboard.test.tsx`
*   **Acesso:** `https://seu-tenant.sharepoint.com/.../#/dashboard`

### 2. Componente (`generate:component`)
Componente React funcional limpo e tipado.
*   **Arquivo:** `src/webparts/app/components/Header.tsx`
*   **Teste:** `tests/components/Header.test.tsx`

### 3. Serviço (`generate:service`)
Classe estática com métodos CRUD prontos para SharePoint.
*   **Arquivo:** `src/core/services/ProjetosService.ts`
*   **Métodos:** `getAll`, `getById`, `create`, `update`, `delete`
*   **Segurança:** Inclui validação automática (`ensureListExists`) em desenvolvimento.

### 4. Hook (`generate:hook`)
Hook React para encapsular lógica de estado ou efeitos.
*   **Arquivo:** `src/core/hooks/usePermissoes.ts`
*   **Estrutura:** Já vem com estados de `data`, `loading` e `error` via TanStack Query.

### 5. Model (`generate:model`)
Interface TypeScript com campos padrão do SharePoint.
*   **Arquivo:** `src/models/IProjeto.ts`
*   **Campos Padrão:** `Id`, `Title`, `Created`, `Author`, etc.

---

## ⚡ Conexão com Listas SharePoint

O gerador agora possui uma inteligência de orquestração. Ao criar uma **Página**, você pode conectá-la diretamente a uma lista do SharePoint.

**O Fluxo Automatizado:**
1. Rode `pnpm run generate` e escolha **Página**.
2. Responda **SIM** para "Deseja conectar essa página a uma lista SharePoint?".
3. Informe o nome da lista (ex: `site_produtos`).
4. Escolha o **Nível de Integração**:

### Opção A: Apenas Leitura (Tabela)
Ideal para dashboards e relatórios.
*   ✅ Gera Model + Service + Hook (Query).
*   ✅ Página exibe tabela com dados e filtro de busca.
*   ❌ Sem botões de editar/excluir ou formulários.

### Opção B: CRUD Completo
Ideal para cadastros e gestão de dados.
*   ✅ Gera tudo da opção A.
*   ✅ Adiciona métodos de Create/Update/Delete no Hook.
*   ✅ Página inclui botões de ação, dialog de exclusão e estrutura para formulários.

**Resultado:**
Em ambos os casos, você ganha 4 arquivos conectados e funcionando (`Model` -> `Service` -> `Hook` -> `Page`) em segundos.

---

## ⚠️ Importante: Marcadores de Código

O gerador utiliza comentários especiais (marcadores) para injetar código de forma segura nos arquivos `App.tsx` e `navigation.ts`.

**Não remova estes comentários:**
*   `/* GENERATOR: IMPORT_PAGE */`
*   `{/* GENERATOR: ROUTE_PAGE */}`
*   `/* GENERATOR: IMPORT_ICON */`
*   `/* GENERATOR: NAV_ITEM */`

Se removidos, o gerador tentará usar um método de fallback, mas a precisão não é garantida.

---

## 💡 Padronização Automática

O gerador ajusta automaticamente o nome dos arquivos para seguir as boas práticas:

| Se você digitar... | O gerador cria... | Tipo |
|--------------------|-------------------|------|
| `minha pagina` | `MinhaPagina.tsx` | Página |
| `header-top` | `HeaderTop.tsx` | Componente |
| `projetos` | `ProjetosService.ts` | Serviço |
| `get-dados` | `useGetDados.ts` | Hook |
| `projeto` | `IProjeto.ts` | Model |

---

## ❓ Perguntas Frequentes

**Posso editar os arquivos gerados?**
Sim! Eles são apenas um ponto de partida para acelerar seu trabalho.

**E se o arquivo já existir?**
O gerador avisa e **não** sobrescreve nada. Você terá que escolher outro nome.

**As rotas funcionam com parâmetros?**
O gerador cria rotas simples. Para rotas com ID (ex: `/detalhe/:id`), edite o `App.tsx` manualmente após gerar.
