import { Routes } from '@angular/router';

export const CONGES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/liste-conges/liste-conges.component')
      .then(m => m.ListeCongesComponent)
  }
];
