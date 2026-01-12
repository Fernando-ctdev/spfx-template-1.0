# 🧪 Testes

Este diretório contém testes unitários e mocks para o projeto SPFx.

## 📁 Estrutura

```
tests/
├── __mocks__/
│   └── spfxMocks.ts          # Mocks de SPFx e PnPjs
├── hooks/
│   └── useSharePoint.test.ts # Exemplo de teste de hook
├── services/
│   └── (seus testes de serviços)
└── components/
    └── (seus testes de componentes)
```

## 🚀 Executar Testes

```bash
# Todos os testes
npm test

# Com coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Arquivo específico
npm test -- useSharePoint.test.ts
```

## 🎯 Usando os Mocks

### Mock do Contexto SPFx

```typescript
import { mockSPFxContext } from '../__mocks__/spfxMocks';

// Use em testes que precisam do contexto
const context = mockSPFxContext;
```

### Mock do PnPjs

```typescript
import { mockPnPjsSP, resetAllMocks } from '../__mocks__/spfxMocks';

beforeEach(() => {
  resetAllMocks();
});

it('deve buscar dados', async () => {
  mockPnPjsSP.web.lists.getByTitle.mockReturnValue({
    items: {
      select: jest.fn().mockReturnThis(),
      top: jest.fn().mockResolvedValue([{ Id: 1, Title: 'Test' }]),
    },
  });
  
  // seu teste aqui
});
```

### Simular Erros

```typescript
import { mockNetworkError, mockPermissionDenied } from '../__mocks__/spfxMocks';

it('deve tratar erro de rede', async () => {
  mockNetworkError();
  // seu teste aqui
});
```

## 📝 Convenções

1. **Nomenclatura**: `NomeDoArquivo.test.ts` ou `NomeDoArquivo.spec.ts`
2. **Localização**: Espelhar estrutura de `src/`
3. **Mocks**: Usar os mocks do `__mocks__/spfxMocks.ts`
4. **Reset**: Sempre chamar `resetAllMocks()` no `beforeEach`

## 🔧 Configuração

O Jest está configurado em `jest.config.js` na raiz do projeto.

### Adicionar novo mock global

Edite `tests/__mocks__/spfxMocks.ts` para adicionar novos mocks reutilizáveis.
