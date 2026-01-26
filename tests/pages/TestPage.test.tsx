import * as React from 'react';
import { render, screen } from '@testing-library/react';
import TestPage from '../src/webparts/app/pages/TestPage';

describe('TestPage', () => {
  it('deve renderizar sem erros', () => {
    render(<TestPage />);
    expect(screen.getByText(/TestPage/i)).toBeInTheDocument();
  });

  // Adicione mais testes aqui
});
