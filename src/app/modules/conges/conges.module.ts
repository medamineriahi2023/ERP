import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CongesRoutingModule } from './conges-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ListeCongesComponent } from './components/liste-conges/liste-conges.component';
import { DemandeCongeComponent } from './components/demande-conge/demande-conge.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CongesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ListeCongesComponent,
    DemandeCongeComponent
  ]
})
export class CongesModule { }
