import { Routes } from '@angular/router';
import { HeroesPage } from './heroes.page';

export const routes: Routes = [
  {
    path: 'heroes',
    component: HeroesPage,
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: '',
        redirectTo: '/heroes/list',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/heroes/list',
    pathMatch: 'full',
  },
];
