import { Routes } from '@angular/router';

export const POINTAGE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard-pointage/dashboard-pointage.component')
          .then(m => m.DashboardPointageComponent)
      },
      {
        path: 'record',
        loadComponent: () => import('./components/enregistrement-pointage/enregistrement-pointage.component')
          .then(m => m.EnregistrementPointageComponent)
      },
      {
        path: 'history',
        loadComponent: () => import('./components/historique-pointage/historique-pointage.component')
          .then(m => m.HistoriquePointageComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./components/rapports-pointage/rapports-pointage.component')
          .then(m => m.RapportsPointageComponent)
      }
    ]
  }
];
