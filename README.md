# 🚀 SPFx Ultimate Template

Uma fundação de engenharia de software para projetos SharePoint Framework profissionais.
Transforme horas de configuração manual em minutos de automação.

> **Começando agora?**
> 👉 [Siga o Guia de Instalação (SETUP.md)](./SETUP.md) para rodar o projeto em 5 minutos.

---

## ✨ Principais Diferenciais

### 🛠️ Automação de Verdade
Esqueça a edição manual de GUIDs, manifestos e arquivos de debug.
*   **`npm run configure`**: Configura todo o ambiente com base em um único arquivo JSON.
*   **`npm run generate`**: Cria páginas, componentes e serviços padronizados via CLI. [Ver detalhes](./GENERATOR.md).

### 🦎 Modo Híbrido (Page vs Widget)
Mude o comportamento da sua aplicação com uma linha de configuração:
*   **Modo Full Page**: Injeção automática de CSS para remover a UI do SharePoint. Perfeito para sistemas e quiosques.
*   **Modo Component**: Comportamento padrão de WebPart. Perfeito para dashboards e widgets.

### ⚡ Developer Experience (DX)
*   **Fast Serve**: Hot Reload de ~1 segundo (contra 15s+ do padrão).
*   **Tailwind CSS**: Configurado e isolado para não quebrar o SharePoint.
*   **React Router Sync**: Deep linking funcionando (URL atualiza conforme você navega).

---

## 🏗️ Arquitetura Técnica

O projeto segue uma estrutura limpa e escalável, evitando o "código espaguete" comum em WebParts grandes.

```
src/
├── config/             # Configurações globais (PnPjs Singleton)
├── core/
│   ├── services/       # Camada de Dados (Abstração de APIs)
│   ├── hooks/          # Lógica de Estado Reutilizável
│   └── helpers/        # Utilitários Puros
├── models/             # Interfaces e Tipos (Zod Schemas)
└── webparts/app/
    ├── pages/          # Telas da Aplicação (Roteamento)
    ├── components/     # Componentes de UI (Burros/Puros)
    └── App.tsx         # Entry Point e Roteador
```

### Stack Tecnológico

| Tecnologia | Versão | Função |
|------------|--------|--------|
| **SPFx** | 1.21.0 | Framework Base (Última LTS) |
| **React** | 17.0.1 | Biblioteca de UI (Padrão Microsoft) |
| **Fluent UI** | v8 | Design System Nativo |
| **Tailwind CSS** | v3.4 | Estilização Utilitária |
| **TanStack Query** | v4 | Cache e Estado Assíncrono |
| **React Router** | v6 | Roteamento (SPA) |
| **Zod** | v3.23 | Validação de Schemas |
| **React Hook Form** | v7.53 | Gestão de Formulários |
| **Lucide React** | v0.477 | Ícones Modernos |

---

## 📐 Regras de Ouro (Governança)

### 1. UI e Componentes
*   **Consulte o [Guia de Estilos (STYLE_GUIDE.md)](./STYLE_GUIDE.md)** para detalhes da estratégia híbrida.
*   **Use Fluent UI v8** para tudo que for possível (Botões, Inputs, Dialogs).
*   **Use Tailwind CSS** apenas para layout (margens, paddings, grids) e customizações finas.
*   **Evite CSS global**. Use Modules ou classes utilitárias do Tailwind.

### 2. Navegação
*   **Sempre use `HashRouter`**. O `BrowserRouter` não funciona bem dentro do SharePoint.
*   O template já trata a sincronização de rota para permitir compartilhar links (Deep Linking).

### 3. Chamadas de Dados
*   **Nunca chame APIs direto no componente**. Crie um `Service` em `src/core/services`.
*   Use `TanStack Query` para cachear as chamadas. Evite `useEffect` para buscar dados.

---

## 📦 Comandos Úteis

| Comando | O que faz |
|---------|-----------|
| `npm run serve` | Inicia servidor local com Hot Reload |
| `npm run build` | Compila o projeto para desenvolvimento |
| `npm run build:prod` | Cria o pacote `.sppkg` para produção |
| `npm run generate` | Abre o gerador de código interativo |
| `npm run test` | Roda os testes unitários |

---

## 🚀 Deploy para Produção

1.  Execute `npm run build:prod`.
2.  Pegue o arquivo `.sppkg` na pasta `sharepoint/solution`.
3.  Arraste para o **App Catalog** do seu tenant.
4.  Adicione o app no site desejado.

---

**Licença MIT** - Sinta-se livre para usar em projetos pessoais e comerciais.
