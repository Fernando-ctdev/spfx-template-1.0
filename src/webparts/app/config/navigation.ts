import { Home } from 'lucide-react';

export interface INavItem {
  title: string;
  path: string;
  icon?: any;
}

export const NAV_ITEMS: INavItem[] = [
  {
    title: 'Início',
    path: '/',
    icon: Home
  },
  // O gerador irá adicionar novos itens aqui automaticamente
];
