# 🎨 Guia de Estilos e UI

Este projeto utiliza uma abordagem **híbrida** combinando **Fluent UI v8** e **Tailwind CSS**.
O objetivo é unir a consistência visual do ecossistema Microsoft com a velocidade de desenvolvimento do Tailwind.

## 🧠 A Estratégia: O Melhor dos Dois Mundos

| Tecnologia | Papel Principal | Por quê? |
|------------|-----------------|----------|
| **Fluent UI** | **Componentes Interativos** | Garante que Botões, Inputs e Dialogs pareçam nativos do SharePoint/Teams. Acessibilidade e comportamento padrão Microsoft. |
| **Tailwind CSS** | **Layout e Espaçamento** | Substitui a verbosidade do `Stack` e `CSS-in-JS` por classes utilitárias rápidas (`flex`, `p-4`, `gap-2`). Reduz drasticamente a quantidade de código escrito. |
| **SCSS Modules** | **Exceções Globais** | Usado apenas para resets e estilos que o Tailwind não cobre (ex: scrollbars customizadas). |

## ⚖️ Regras de Decisão

### ✅ Use Fluent UI quando:
*   Precisar de um componente interativo (**Button**, **TextField**, **DatePicker**, **Dropdown**).
*   Precisar de ícones padrão do sistema (`FontIcon`).
*   Precisar acessar cores do tema do SharePoint (via `ITheme`).

### ✅ Use Tailwind CSS quando:
*   Definir estruturas de layout (**Flexbox**, **Grid**).
*   Ajustar margens, paddings, larguras e alturas.
*   Estilizar containers (cards, bordas, sombras, arredondamento).
*   Tratar responsividade (`md:flex`, `lg:w-1/2`).

### ❌ Evite:
*   **Não use** `Stack` do Fluent para layouts simples. É pesado e verboso. Prefira `flex gap-4`.
*   **Não crie** arquivos `.css` ou `.scss` para cada componente novo. Tente resolver com classes utilitárias.
*   **Não force** estilos no Fluent via CSS global (`!important`). Use a prop `styles` do próprio componente se precisar customizá-lo.

## 💻 Exemplo Prático

**Ruim (Apenas Fluent - Verboso):**
```tsx
// Muito código para algo simples, runtime overhead do CSS-in-JS
<Stack tokens={{ childrenGap: 10 }} styles={{ root: { padding: 20, background: 'white', borderRadius: 4 } }}>
  <Text variant="xLarge">Título</Text>
  <PrimaryButton text="Salvar" />
</Stack>
```

**Bom (Híbrido - Limpo e Performático):**
```tsx
// HTML limpo, classes padrão, zero runtime overhead
<div className="p-5 bg-white flex flex-col gap-2.5 rounded shadow-sm">
  <h2 className="text-xl font-semibold text-gray-800">Título</h2>
  <PrimaryButton text="Salvar" />
</div>
```
