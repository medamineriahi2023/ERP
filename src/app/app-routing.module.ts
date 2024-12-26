import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/components/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'employees',
        loadChildren: () => import('./modules/employees/employees.module').then(m => m.EmployeesModule)
      },
      {
        path: 'conge',
        loadChildren: () => import('./modules/conge/conge.module').then(m => m.CongeModule)
      },
      {
        path: 'pointage',
        loadChildren: () => import('./modules/pointage/pointage.module').then(m => m.PointageModule)
      },
      {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
