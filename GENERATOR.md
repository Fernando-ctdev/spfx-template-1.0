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
*   **Uso:** `await ProjetosService.getAll('ListaProjetos')`

### 4. Hook (`generate:hook`)
Hook React para encapsular lógica de estado ou efeitos.
*   **Arquivo:** `src/core/hooks/usePermissoes.ts`
*   **Estrutura:** Já vem com estados de `data`, `loading` e `error`.

### 5. Model (`generate:model`)
Interface TypeScript com campos padrão do SharePoint.
*   **Arquivo:** `src/models/IProjeto.ts`
*   **Campos Padrão:** `Id`, `Title`, `Created`, `Author`, etc.

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
