import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Table from '../components/Table';



describe('Testando o componente Table', () => {
  it('O botão de criar novas tarefas está sempre visível', () => {
  const btn = screen.getByRole('button', { name: /tarefa/i });
  expect(btn).toBeInTheDocument();
  })
   
});