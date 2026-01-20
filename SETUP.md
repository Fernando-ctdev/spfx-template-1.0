# 🛠️ Guia de Instalação e Configuração

Configure seu ambiente SPFx em menos de 5 minutos.

## 📋 Pré-requisitos
*   **Node.js**: Versão 18.x (LTS) recomendada.
*   **Gerenciador de Pacotes**: NPM (vem com o Node).
*   **Acesso**: Um tenant do SharePoint Online.

---

## 1️⃣ Configuração do Node.js (Essencial)

O SPFx exige versões específicas do Node. Use o NVM para evitar dores de cabeça.

```bash
# Instala e usa a versão correta (18)
nvm install 18
nvm use 18
```

---

## 2️⃣ Configuração do Projeto

Abra o arquivo `app.config.json` na raiz do projeto (ele já vem criado) e ajuste com os dados do seu ambiente:

```json
{
  "tenant": "sua-empresa",        // Ex: "microsoft" (sem .sharepoint.com)
  "siteUrl": "/sites/intranet",   // URL relativa do site onde vai testar
  "appName": "minha-intranet",    // Nome interno do projeto (sem espaços)
  "appTitle": "Portal Corporativo", // Nome que aparece para o usuário
  "mode": "page"              // "page" (App) ou "component" (Widget)
}
```

### 🎯 Entendendo o `mode`
*   **`page`**: A WebPart assume a tela inteira (Full Page). Remove cabeçalhos e menus do SharePoint. Ideal para sistemas e portais imersivos.
*   **`component`**: A WebPart se comporta como um widget normal. Mantém a navegação do SharePoint. Ideal para dashboards e pedaços de funcionalidade.

---

## 3️⃣ Instalação Automática

Execute o comando mágico. Ele instala dependências e aplica suas configurações.

```bash
npm install
```

O script irá ler seu `app.config.json` e configurar todo o projeto automaticamente.

---

## 4️⃣ Rodando o Projeto

Inicie o servidor de desenvolvimento local com Hot Reload (Fast Serve).

```bash
npm run serve
```

O navegador abrirá automaticamente em:
`https://{tenant}.sharepoint.com{siteUrl}/_layouts/workbench.aspx`

---

## 🆘 Resolução de Problemas Comuns

**Erro: "Versão do Node incompatível"**
Rode `nvm use 18` e tente novamente.

**Erro: "A página não abre ou dá 404"**
Verifique se o `siteUrl` no `app.config.json` existe no seu tenant.

**Erro: "Mudanças no app.config.json não surtem efeito"**
Rode `npm run configure` para aplicar as novas configurações.
