# 🎯 Guia de Modos: Full Page vs WebPart

Este template SPFx suporta **dois modos** de desenvolvimento, cada um otimizado para diferentes casos de uso.

---

## 🖥️ Modo Full Page

### O que é?

Modo para criar **aplicações completas** que ocupam toda a página do SharePoint, ocultando a navegação e header nativos.

### Configuração

```json
{
  "mode": "fullpage"
}
```

### O que acontece?

✅ CSS do SharePoint é automaticamente importado  
✅ Header e navegação do SharePoint são ocultados  
✅ Sua aplicação React assume controle total da página  
✅ React Router gerencia toda a navegação  

### Quando usar?

- ✅ **Portais corporativos** - Intranet, extranet
- ✅ **Dashboards executivos** - Visualizações de dados complexas
- ✅ **Sistemas completos** - CRM, ERP, gestão de projetos
- ✅ **Aplicações SPA** - Experiência de usuário customizada
- ✅ **Interfaces modernas** - Design system próprio

### Características

| Aspecto | Comportamento |
|---------|---------------|
| **Header SharePoint** | ❌ Oculto |
| **Navegação SharePoint** | ❌ Oculta |
| **Barra Office 365** | ❌ Oculta |
| **React Router** | ✅ Controle total |
| **Múltiplas instâncias** | ❌ Uma por página |
| **Convive com outros WebParts** | ❌ Não recomendado |

### Exemplo de Uso

```typescript
// App.tsx - Controle total da navegação
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/users" element={<Users />} />
  <Route path="/settings" element={<Settings />} />
</Routes>
```

### Layout Típico

```
┌─────────────────────────────────────────┐
│                                         │
│         SUA APLICAÇÃO REACT             │
│         (Controle Total)                │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Header Customizado             │   │
│  ├─────────────────────────────────┤   │
│  │  Navegação Customizada          │   │
│  ├─────────────────────────────────┤   │
│  │                                 │   │
│  │  Conteúdo Principal             │   │
│  │  (Rotas React Router)           │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🧩 Modo WebPart

### O que é?

Modo para criar **componentes reutilizáveis** que convivem com outros elementos do SharePoint.

### Configuração

```json
{
  "mode": "webpart"
}
```

### O que acontece?

✅ CSS do SharePoint NÃO é importado  
✅ Header e navegação do SharePoint permanecem visíveis  
✅ Seu componente se integra à página existente  
✅ Pode ter múltiplas instâncias na mesma página  

### Quando usar?

- ✅ **Widgets** - Gráficos, contadores, indicadores
- ✅ **Formulários** - Cadastros, pesquisas, feedback
- ✅ **Listas customizadas** - Visualizações especiais de dados
- ✅ **Integrações** - APIs externas, serviços
- ✅ **Componentes reutilizáveis** - Usados em várias páginas

### Características

| Aspecto | Comportamento |
|---------|---------------|
| **Header SharePoint** | ✅ Visível |
| **Navegação SharePoint** | ✅ Visível |
| **Barra Office 365** | ✅ Visível |
| **React Router** | ⚠️ Limitado (não recomendado) |
| **Múltiplas instâncias** | ✅ Sim |
| **Convive com outros WebParts** | ✅ Sim |

### Exemplo de Uso

```typescript
// Componente focado e específico
const UserStatsWidget: React.FC = () => {
  const { items, loading } = useListItems('Users');
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Estatísticas de Usuários</Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <StatCard title="Total" value={items.length} />
        </Grid>
        {/* ... mais stats */}
      </Grid>
    </Box>
  );
};
```

### Layout Típico

```
┌─────────────────────────────────────────┐
│  Header SharePoint                      │
├─────────────────────────────────────────┤
│  Navegação SharePoint                   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐  ┌─────────────┐     │
│  │ Seu WebPart │  │ Outro       │     │
│  │             │  │ WebPart     │     │
│  └─────────────┘  └─────────────┘     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Seu WebPart (outra instância)   │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔄 Como Trocar de Modo

### Passo a Passo

1. **Edite o `app.config.json`:**

```json
{
  "tenant": "suaempresa",
  "siteUrl": "/sites/seusite",
  "appName": "meu-app",
  "appTitle": "Meu App",
  "mode": "webpart"  // ← Mude aqui
}
```

2. **Execute o script de configuração:**

```bash
npm run configure
```

3. **Pronto!** O template foi reconfigurado automaticamente.

### O que é alterado?

O script `configure.js` automaticamente:

- ✅ Adiciona/remove o import do `sharepoint.css`
- ✅ Atualiza o `AppWebPart.ts`
- ✅ Mostra mensagem de confirmação

---

## 📊 Comparação Rápida

| Característica | Full Page | WebPart |
|----------------|-----------|---------|
| **Controle da UI** | Total | Parcial |
| **Header SharePoint** | Oculto | Visível |
| **Navegação própria** | Sim (Router) | Limitada |
| **Múltiplas instâncias** | Não | Sim |
| **Complexidade** | Alta | Média/Baixa |
| **Ideal para** | Aplicações completas | Componentes específicos |

---

## 💡 Dicas e Boas Práticas

### Full Page

✅ **Use React Router** para navegação  
✅ **Crie um layout consistente** com header/sidebar  
✅ **Implemente autenticação** se necessário  
✅ **Otimize performance** - lazy loading, code splitting  
✅ **Teste responsividade** - mobile, tablet, desktop  

### WebPart

✅ **Mantenha componentes focados** - uma responsabilidade  
✅ **Use Property Pane** para configurações  
✅ **Evite React Router** - pode conflitar  
✅ **Teste com outros WebParts** na mesma página  
✅ **Considere tamanhos diferentes** - 1/3, 1/2, full width  

---

## 🔧 Troubleshooting

### Full Page não está ocultando elementos

**Problema:** Header do SharePoint ainda aparece  
**Solução:**
1. Verifique se `mode: "fullpage"` está no `app.config.json`
2. Execute `npm run configure`
3. Verifique se o import do `sharepoint.css` está no `AppWebPart.ts`

### WebPart com elementos ocultos

**Problema:** Header do SharePoint está oculto no modo webpart  
**Solução:**
1. Verifique se `mode: "webpart"` está no `app.config.json`
2. Execute `npm run configure`
3. Verifique se o import do `sharepoint.css` NÃO está no `AppWebPart.ts`

### Conflitos de CSS

**Problema:** Estilos estranhos ou conflitantes  
**Solução:**
- Use `sx` prop do Material UI (CSS-in-JS)
- Evite CSS global
- Use módulos CSS quando necessário

---

## 📚 Recursos Adicionais

- [Documentação do Template](./README.md)
- [Gerador de Código](./GENERATOR.md)
- [SharePoint Framework Docs](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview)

---

## 🎉 Conclusão

Escolha o modo que melhor se adapta ao seu projeto:

- **Full Page** → Aplicações completas e complexas
- **WebPart** → Componentes específicos e reutilizáveis

E o melhor: **você pode trocar de modo a qualquer momento!** 🚀

