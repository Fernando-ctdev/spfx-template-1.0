# 🛠️ Configuração Inicial do SPFx Template

## 📋 Pré-requisitos

- Node.js 18.17.x LTS ou 20.11.x LTS
- NVM (Node Version Manager) - Recomendado
- Acesso a um tenant SharePoint Online

### 🔧 Configurando o Node.js com NVM

```bash
# Instalar a versão correta do Node
nvm install 20

# Usar a versão 20
nvm use 20

# Verificar a versão
node -v
```

## 🚀 Instalação (Super Simples!)

### 1. Clone ou copie o template

### 2. Configure TUDO em um único arquivo! 📝

Edite apenas o arquivo `app.config.json` na raiz do projeto:

```json
{
  "tenant": "contoso",
  "siteUrl": "/sites/meusite",
  "appName": "my-spfx-app", //Este será o nome da webpart
  "appTitle": "My App",  //Este será o nome da webpart
  "mode": "fullpage" //Modo fullpage ou webpart
}
```

**Só isso!** 5 campos:

| Campo | O que é | Valores | Exemplo |
|-------|---------|---------|---------|
| `tenant` | Nome do seu tenant (sem .sharepoint.com) | - | `contoso` |
| `siteUrl` | Caminho do site | - | `/sites/meusite` |
| `appName` | Nome técnico do app (sem espaços) | - | `portal-rh` |
| `appTitle` | Nome que aparece no SharePoint | - | `Portal RH` |
| `mode` | Tipo de aplicação | `fullpage` ou `webpart` | `fullpage` |

## 🎯 Modos de Aplicação

O template suporta **dois modos** de desenvolvimento, configurados automaticamente no `app.config.json`:

### 🖥️ **Modo Full Page (`"mode": "fullpage"`)**

**Para aplicações que ocupam a página inteira:**

- ✅ Oculta automaticamente header e navegação do SharePoint
- ✅ Controle total da interface do usuário
- ✅ Ideal para portais, dashboards e aplicações completas
- ✅ React Router para navegação SPA

### 🧩 **Modo WebPart (`"mode": "webpart"`)**

**Para componentes que convivem com o SharePoint:**

- ✅ Mantém header e navegação do SharePoint visíveis
- ✅ Pode ser inserido em qualquer página
- ✅ Convive com outros WebParts
- ✅ Múltiplas instâncias na mesma página

> 💡 Os GUIDs são gerados automaticamente na primeira execução!

### 3. Instale as dependências

```bash
npm install
```

O script vai automaticamente:
- ✅ Ler o `app.config.json`
- ✅ Atualizar `config/package-solution.json`
- ✅ Atualizar `fast-serve/config.json`
- ✅ Atualizar `config/serve.json`
- ✅ Atualizar `src/webparts/app/AppWebPart.manifest.json`
- ✅ Configurar o modo (fullpage ou webpart) automaticamente
- ✅ Remover este arquivo de setup e o script de configuração

### 4. Execute em modo de desenvolvimento

```bash
npm run serve
```

**Pronto!** 🎉 O navegador abrirá automaticamente no seu site SharePoint.

---

## ❓ Problemas Comuns

### Erro: "Node version not compatible"
```bash
nvm use 20
```
---

> 📖 Após a configuração inicial, consulte o **README.md** para documentação de uso do template.
