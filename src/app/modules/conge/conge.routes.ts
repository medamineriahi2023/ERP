import { Routes } from '@angular/router';
import { DashboardCongeComponent } from './components/dashboard-conge/dashboard-conge.component';
import { CalendrierCongeComponent } from './components/calendrier-conge/calendrier-conge.component';
import { DemandeCongeComponent } from './components/demande-conge/demande-conge.component';

export const CONGE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'requests',
        pathMatch: 'full'
      },
      {
        path: 'requests',
        component: DemandeCongeComponent,
        title: 'Demandes de congés'
      },
      {
        path: 'calendar',
        component: CalendrierCongeComponent,
        title: 'Calendrier des congés'
      }
    ]
  }
];
