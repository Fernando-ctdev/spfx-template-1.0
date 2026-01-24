module.exports = (name, type) => `import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ${name} from '../src/${type === 'page' ? 'webparts/app/pages' : type === 'component' ? 'webparts/app/components' : 'core/hooks'}/${name}';

describe('${name}', () => {
  it('deve renderizar sem erros', () => {
    ${type === 'page' || type === 'component' ? `render(<${name} />);
    expect(screen.getByText(/${name}/i)).toBeInTheDocument();` : `// Adicione seus testes aqui`}
  });

  // Adicione mais testes aqui
});
`;
