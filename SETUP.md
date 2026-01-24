# 🛠️ Guia de Instalação e Configuração

Configure seu ambiente SPFx em menos de 5 minutos com nosso Wizard interativo.

## 📋 Pré-requisitos
*   **Node.js**: Versão 18.x (LTS) obrigatória (>= 18.17.1).
*   **Gerenciador de Pacotes**: PNPM (Obrigatório). O projeto não suporta npm/yarn.
*   **Acesso**: Um tenant do SharePoint Online.

---

## 1️⃣ Configuração do Node.js (Essencial)

O SPFx exige versões específicas do Node. Use o NVM para evitar dores de cabeça.

```bash
# Instala e usa a versão correta (18)
nvm install 18
nvm use 18

# Instala o pnpm globalmente (se ainda não tiver)
npm install -g pnpm
```

---

## 2️⃣ Instalação e Configuração Interativa

Este template possui um assistente que configura tudo para você. Não é necessário editar arquivos manualmente.

1.  **Instale as dependências:**
    ```bash
    pnpm install
    ```

2.  **Execute o assistente de configuração:**
    ```bash
    pnpm run configure
    ```

3.  **Responda às perguntas no terminal:**
    O assistente solicitará:
    *   **Tenant**: O subdomínio da sua empresa (ex: https://`minhaempresa`.sharepoint.com/sites/meu-site).
    *   **Site URL**: Onde a app será testada (ex: https://minhaempresa.sharepoint.com`/sites/meu-site`).
    *   **Nome e Título**: Identificação da aplicação no Gerenciador de aplicativos Sharepoint.
    *   **Modo**: `Page` (Tela cheia) ou `Componente` (Widget padrão).
    *   **Layout**: `Navbar`, `Sidebar` ou `Blank` (Apenas o conteúdo).

---

## 3️⃣ Entendendo as Opções

### 🎯 Modos de Execução (`SPFX_MODE`)
*   **`page` (Full Page)**: A WebPart assume a tela inteira. Remove cabeçalhos e menus nativos do SharePoint. Ideal para sistemas e Single Page Applications (SPA).
*   **`component` (WebPart)**: A WebPart se comporta como um widget normal. Mantém a navegação e menus do SharePoint. Ideal para dashboards e funcionalidades integradas.

### 📐 Opções de Layout
*   **Navbar**: Menu superior fixo (Padrão).
*   **Sidebar**: Menu lateral esquerdo fixo (Novo).
*   **Blank**: Sem menu, apenas a área de conteúdo limpa.

---

## 4️⃣ Rodando o Projeto

Inicie o servidor de desenvolvimento local com Hot Reload (Fast Serve).

```bash
pnpm run serve
```

O navegador abrirá automaticamente no Workbench do SharePoint configurado.

---

## 📦 Gerando Versão de Produção

Para gerar o pacote `.sppkg` final para deploy:

```bash
pnpm run build:prod
```

**Este comando executa automaticamente:**
1.  Limpeza da pasta `dist` e `temp`.
2.  **Bump Version**: Incrementa a versão (revision) no `package-solution.json` automaticamente (ex: `1.0.0.0` -> `1.0.0.1`).
3.  Build otimizado (minificado).
4.  Empacotamento da solução.

O arquivo final estará em: `sharepoint/solution/seu-projeto.sppkg`

---

## 🆘 Resolução de Problemas Comuns

**Erro: "Versão do Node incompatível"**
Rode `nvm use 18` e tente novamente.

**Erro: "A página não abre ou dá 404"**
Verifique se o `SPFX_SITE_URL` informado existe no seu tenant.

**Erro: "Quero mudar o Layout ou Modo depois de configurar"**
Basta rodar `pnpm run configure` novamente e escolher as novas opções. O script irá atualizar o projeto automaticamente preservando seus GUIDs.
