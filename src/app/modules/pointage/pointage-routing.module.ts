import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPointageComponent } from './components/dashboard-pointage/dashboard-pointage.component';
import { EnregistrementPointageComponent } from './components/enregistrement-pointage/enregistrement-pointage.component';
import { HistoriquePointageComponent } from './components/historique-pointage/historique-pointage.component';
import { RapportsPointageComponent } from './components/rapports-pointage/rapports-pointage.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPointageComponent
  },
  {
    path: 'record',
    component: EnregistrementPointageComponent
  },
  {
    path: 'history',
    component: HistoriquePointageComponent
  },
  {
    path: 'reports',
    component: RapportsPointageComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointageRoutingModule { }
