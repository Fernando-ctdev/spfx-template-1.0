import * as React from 'react';
import { render, screen } from '@testing-library/react';
import TestIcon from '../src/webparts/app/components/TestIcon';

describe('TestIcon', () => {
  it('deve renderizar sem erros', () => {
    render(<TestIcon />);
    expect(screen.getByText(/TestIcon/i)).toBeInTheDocument();
  });

  // Adicione mais testes aqui
});
