# 🛠️ Configuração Inicial

> Este arquivo será **removido automaticamente** após `npm install`.

## 📋 Pré-requisitos

- **Node.js 18.x LTS** (recomendado) ou 20.x
- NVM (Node Version Manager)
- Tenant SharePoint Online

## 1️⃣ Configurar Node.js

```bash
# Usar versão do .nvmrc (recomendado)
nvm use

# Ou instalar Node 18
nvm install 18 && nvm use 18
```

## 2️⃣ Configurar o Projeto

Edite `app.config.json`:

```json
{
  "tenant": "contoso",
  "siteUrl": "/sites/my-site",
  "appName": "portal-rh",
  "appTitle": "Portal RH",
  "mode": "fullpage"
}
```

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| tenant | Seu tenant (sem .sharepoint.com) | `contoso` |
| siteUrl | Caminho do site | `/sites/intranet` |
| appName | Nome técnico (sem espaços) | `portal-rh` |
| appTitle | Nome exibido | `Portal RH` |
| mode | `fullpage` ou `webpart` | `fullpage` |

### Modos disponíveis:

- **fullpage** → Oculta header do SharePoint, controle total da UI
- **webpart** → Convive com elementos do SharePoint

## 3️⃣ Instalar e Executar

```bash
npm install    # Configura tudo automaticamente
npm run serve  # Abre no navegador
```

## ❓ Problemas?

```bash
# Erro de versão do Node
nvm use

# Limpar cache
npm run clean && npm install
```

---

📖 **Após instalação, veja o [README.md](./README.md) para documentação completa.**
