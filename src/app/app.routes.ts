import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./heroes/heroes.routes').then((m) => m.routes),
  },
];
