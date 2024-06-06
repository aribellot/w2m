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
          import('./components/list/list.page').then((m) => m.ListPage),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./components/create/create.page').then((m) => m.CreatePage),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./components/edit/edit.page').then((m) => m.EditPage),
      },
      {
        path: '',
        redirectTo: '/heroes/list',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '/error',
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
