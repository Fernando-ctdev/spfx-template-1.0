import * as React from 'react';
import { render, screen } from '@testing-library/react';
import TestComponent from '../src/webparts/app/components/TestComponent';

describe('TestComponent', () => {
  it('deve renderizar sem erros', () => {
    render(<TestComponent />);
    expect(screen.getByText(/TestComponent/i)).toBeInTheDocument();
  });

  // Adicione mais testes aqui
});
