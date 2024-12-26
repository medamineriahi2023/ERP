import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

// FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';

// Components
import { DashboardCongeComponent } from './components/dashboard-conge/dashboard-conge.component';
import { CalendrierCongeComponent } from './components/calendrier-conge/calendrier-conge.component';
import { CongeNavComponent } from './components/conge-nav/conge-nav.component';
import { DemandeCongeComponent } from './components/demande-conge/demande-conge.component';
import { ValidationCongeComponent } from './components/validation-conge/validation-conge.component';
import { CongeRoutingModule } from './conge-routing.module';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    DashboardCongeComponent,
    CalendrierCongeComponent,
    CongeNavComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CongeRoutingModule,
    CardModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    InputTextareaModule,
    ToastModule,
    ProgressBarModule,
    TimelineModule,
    ChipModule,
    AvatarModule,
    TooltipModule,
    FullCalendarModule
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CongeModule { }
