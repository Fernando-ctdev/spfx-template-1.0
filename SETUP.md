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
 
1.  Copie o arquivo `.env.example` para `.env` na raiz do projeto.
2.  Preencha as variáveis com os dados do seu ambiente:
 
```ini
# Tenant do SharePoint (apenas o subdomínio)
# Ex: https://minhaempresa.sharepoint.com -> minhaempresa
SPFX_TENANT=sua-empresa
 
# URL relativa do site
# Ex: /sites/meu-projeto
SPFX_SITE_URL=/sites/seu-site
 
# Nome interno da aplicação (sem espaços, kebab-case)
SPFX_APP_NAME=spfx-app
 
# Título de exibição da aplicação
SPFX_APP_TITLE=Minha Aplicação SPFx
 
# Modo de execução: 'page' (Tela cheia) ou 'component' (WebPart padrão)
SPFX_MODE=page
```
 
### 🎯 Entendendo o `SPFX_MODE`
*   **`page`**: A WebPart assume a tela inteira (Full Page). Remove cabeçalhos e menus do SharePoint. Ideal para sistemas e portais imersivos.
*   **`component`**: A WebPart se comporta como um widget normal. Mantém a navegação do SharePoint. Ideal para dashboards e pedaços de funcionalidade.
 
---
 
## 3️⃣ Instalação Automática
 
Execute o comando mágico. Ele instala dependências e aplica suas configurações.
 
```bash
npm install
```
 
O script irá ler seu arquivo `.env` e configurar todo o projeto automaticamente.
 
---
 
## 4️⃣ Rodando o Projeto
 
Inicie o servidor de desenvolvimento local com Hot Reload (Fast Serve).
 
```bash
npm run serve
```
 
O navegador abrirá automaticamente em:
`https://{SPFX_TENANT}.sharepoint.com{SPFX_SITE_URL}/_layouts/workbench.aspx`
 
---
 
## 🆘 Resolução de Problemas Comuns
 
**Erro: "Versão do Node incompatível"**
Rode `nvm use 18` e tente novamente.
 
**Erro: "A página não abre ou dá 404"**
Verifique se o `SPFX_SITE_URL` no `.env` existe no seu tenant.
 
**Erro: "Mudanças no .env não surtem efeito"**
Rode `npm run configure` para aplicar as novas configurações.
