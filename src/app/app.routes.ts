import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./heroes/heroes.routes').then((m) => m.routes),
  },
  {
    path: 'error',
    loadChildren: () => import('./error/error.routes').then((m) => m.routes),
  },
];
