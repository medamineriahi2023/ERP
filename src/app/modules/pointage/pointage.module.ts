import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PointageRoutingModule } from './pointage-routing.module';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';

// Components
import { DashboardPointageComponent } from './components/dashboard-pointage/dashboard-pointage.component';
import { RecordPointageComponent } from './components/record-pointage/record-pointage.component';
import { HistoryPointageComponent } from './components/history-pointage/history-pointage.component';
import { ReportsPointageComponent } from './components/reports-pointage/reports-pointage.component';

@NgModule({
  declarations: [
    DashboardPointageComponent,
    RecordPointageComponent,
    HistoryPointageComponent,
    ReportsPointageComponent
  ],
  imports: [
    CommonModule,
    PointageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    CardModule,
    ChartModule,
    TooltipModule,
    ProgressBarModule,
    TagModule,
    TimelineModule
  ]
})
export class PointageModule { }
