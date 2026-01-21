# 🏗️ Arquitetura do Projeto

Este documento descreve os princípios de arquitetura, design patterns e decisões técnicas adotadas neste template. O objetivo é garantir escalabilidade, manutenibilidade e alta performance.

## 🎯 Visão Geral

O projeto adota uma arquitetura **SPA (Single Page Application)** rodando dentro do contexto do SharePoint (SPFx). Diferente da abordagem clássica de "múltiplas webparts isoladas", este template favorece a criação de uma **aplicação coesa** que gerencia seu próprio roteamento e estado.

### Principais Benefícios
1.  **Navegação Instantânea**: Troca de telas sem recarregar o SharePoint (Zero Refresh).
2.  **Estado Persistente**: O estado da aplicação (ex: dados carregados, filtros) não é perdido ao navegar.
3.  **Reutilização Extrema**: Componentes e Hooks compartilhados em todo o fluxo.

---

## 🧩 Estrutura de Pastas

A organização segue o padrão **Domain-Driven** simplificado:

```
src/
├── core/               # Núcleo da aplicação (agnóstico a telas)
│   ├── helpers/        # Funções puras utilitárias
│   ├── hooks/          # React Hooks (regras de negócio e conexão SP)
│   └── services/       # Camada de Dados (PnPjs, APIs externas)
├── models/             # Interfaces e Tipos TypeScript (Contratos)
├── webparts/app/       # A Camada de Apresentação
│   ├── components/     # Componentes reutilizáveis (botões, cards, layout)
│   ├── config/         # Configurações estáticas (Menu, Constantes)
│   ├── pages/          # Telas da aplicação (Rotas)
│   └── App.tsx         # Ponto de entrada e Roteador
```

---

## 🚦 Roteamento e Navegação

Utilizamos `react-router-dom` para gerenciar a navegação interna.

*   **Configuração Centralizada**: O arquivo `src/webparts/app/config/navigation.ts` controla os itens do menu.
*   **Layout Wrapper**: O componente `Layout.tsx` envolve todas as rotas, garantindo que a Navbar e o Footer persistam.
*   **Gerador Automático**: Ao rodar `npm run generate:page`, o sistema automaticamente:
    1.  Cria o arquivo da página.
    2.  Registra a rota no `App.tsx`.
    3.  Adiciona o link no `navigation.ts`.

---

## 🎨 Estilização (Híbrida)

Combinamos o melhor de dois mundos para produtividade e compatibilidade:

1.  **Fluent UI v8**: Para componentes complexos (Grids, DetailsList, Pickers) que precisam parecer nativos do Microsoft 365.
2.  **Tailwind CSS**: Para layout, espaçamento, tipografia e componentes customizados. Proporciona desenvolvimento visual extremamente rápido.
    *   *Nota*: O Tailwind está configurado para conviver com o CSS do SharePoint sem conflitos agressivos.

---

## 💾 Gerenciamento de Estado e Dados

1.  **Server State (Dados Remotos)**:
    *   Utilizamos **TanStack Query (React Query)** via hooks customizados (`useSharePoint`).
    *   **Por que?** Gerencia cache, refetching, loading states e erros automaticamente. Evita o "useEffect hell".

2.  **Client State (Dados Locais)**:
    *   Utilizamos **React Context** para estados globais leves (ex: Tema, Usuário Atual).
    *   Para estados complexos de formulário, recomenda-se `react-hook-form`.

---

## 🤖 Automação e DX (Developer Experience)

O projeto inclui uma CLI interna (`scripts/generate.js`) para padronizar a criação de artefatos.

*   **Comando**: `pnpm run generate`
*   **Filosofia**: "Convention over Configuration". O gerador impõe a estrutura de pastas correta, garantindo que todos os desenvolvedores sigam o mesmo padrão arquitetural.

---

## 🛡️ Boas Práticas Adotadas

1.  **Isolamento de Lógica**: Componentes de UI não devem fazer chamadas diretas ao SharePoint. Use Hooks/Services.
2.  **Tipagem Estrita**: Tudo deve ter interface definida em `models/`. Evite `any`.
3.  **Configuração via Ambiente**: Strings mágicas e URLs devem ficar em arquivos de config, nunca hardcoded nos componentes.

---

## 🚀 Como Evoluir

*   **Novas Rotas**: Use o gerador ou edite `App.tsx` + `navigation.ts`.
*   **Novos Serviços**: Crie em `core/services` estendendo o padrão PnPjs.
*   **Modo Widget**: Se for usar como Widget (pequeno), você pode remover o `<Layout>` do `App.tsx` ou criar uma rota específica sem layout.
