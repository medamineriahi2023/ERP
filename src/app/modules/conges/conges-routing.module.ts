import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeCongesComponent } from './components/liste-conges/liste-conges.component';
import { DemandeCongeComponent } from './components/demande-conge/demande-conge.component';

const routes: Routes = [
  {
    path: '',
    component: ListeCongesComponent
  },
  {
    path: 'demande',
    component: DemandeCongeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CongesRoutingModule { }
