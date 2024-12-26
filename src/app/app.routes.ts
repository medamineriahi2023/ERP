import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/components/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'pointage',
        pathMatch: 'full'
      },
      {
        path: 'employees',
        loadChildren: () => import('./modules/employees/employees.routes')
          .then(m => m.EMPLOYEES_ROUTES)
      },
      {
        path: 'pointage',
        loadChildren: () => import('./modules/pointage/pointage.routes')
          .then(m => m.POINTAGE_ROUTES)
      },
      {
        path: 'conge',
        loadChildren: () => import('./modules/conge/conge.routes')
          .then(m => m.CONGE_ROUTES)
      }
    ]
  }
];
