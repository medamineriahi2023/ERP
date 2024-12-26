import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { CongeService } from '../../../../shared/services/conge.service';
import { CongeRequest, CongeType, UrgencyLevel, CongeStatus } from '../../../../shared/models/conge.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextarea } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChipModule } from 'primeng/chip';
import { CongeNavComponent } from '../conge-nav/conge-nav.component';

@Component({
  selector: 'app-dashboard-conge',
  templateUrl: './dashboard-conge.component.html',
  styleUrls: ['./dashboard-conge.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    InputTextarea,
    ToastModule,
    ProgressBarModule,
    ChipModule,
    CongeNavComponent
  ],
  providers: [MessageService]
})
export class DashboardCongeComponent implements OnInit {
  @ViewChild('calendar') calendar!: Calendar;

  conges: CongeRequest[] = [];
  congeBalance: any = null;
  showRequestDialog = false;
  dateRange: Date[] = [];
  publicHolidays: Date[] = [];
  minDate: Date = new Date();

  newRequest = {
    type: undefined as CongeType | undefined,
    urgencyLevel: 'NORMAL' as UrgencyLevel,
    startDate: null as Date | null,
    endDate: null as Date | null,
    reason: '',
    status: 'EN_ATTENTE' as CongeStatus
  };

  typeOptions = [
    { label: 'Congé payé', value: 'CONGE_PAYE' as CongeType },
    { label: 'Maladie', value: 'MALADIE' as CongeType },
    { label: 'Sans solde', value: 'SANS_SOLDE' as CongeType },
    { label: 'Formation', value: 'FORMATION' as CongeType },
    { label: 'Autre', value: 'AUTRE' as CongeType }
  ];

  urgencyOptions = [
    { label: 'Normal', value: 'NORMAL' as UrgencyLevel },
    { label: 'Urgent', value: 'URGENT' as UrgencyLevel }
  ];

  constructor(
    private messageService: MessageService,
    private congeService: CongeService
  ) {}

  ngOnInit() {
    // Initialize public holidays
    this.publicHolidays = [
      new Date(2024, 0, 1),  // New Year
      new Date(2024, 4, 1),  // Labor Day
      new Date(2024, 7, 20), // Revolution Day
      new Date(2024, 7, 21)  // Youth Day
    ];
    this.loadConges();
    this.loadCongeBalance();
  }

  openRequestDialog() {
    this.newRequest = {
      type: undefined,
      urgencyLevel: 'NORMAL',
      startDate: null,
      endDate: null,
      reason: '',
      status: 'EN_ATTENTE'
    };
    this.dateRange = [];
    this.showRequestDialog = true;
  }

  onSubmit() {
    if (!this.validateRequest()) {
      return;
    }

    if (this.dateRange && this.dateRange.length === 2) {
      this.newRequest.startDate = this.dateRange[0];
      this.newRequest.endDate = this.dateRange[1];
    }

    const request: Partial<CongeRequest> = {
      employeeId: 1,
      startDate: this.newRequest.startDate!,
      endDate: this.newRequest.endDate!,
      type: this.newRequest.type!,
      reason: this.newRequest.reason,
      urgencyLevel: this.newRequest.urgencyLevel,
      status: this.newRequest.status,
      duration: this.calculateDuration(this.newRequest.startDate!, this.newRequest.endDate!)
    };

    this.congeService.submitCongeRequest(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Votre demande a été soumise avec succès'
        });
        this.showRequestDialog = false;
        this.resetForm();
        this.loadConges();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors de la soumission de votre demande'
        });
      }
    });
  }

  validateRequest(): boolean {
    if (!this.newRequest.type) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez sélectionner un type de congé'
      });
      return false;
    }
    if (!this.newRequest.startDate || !this.newRequest.endDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez sélectionner les dates de congé'
      });
      return false;
    }
    if (this.newRequest.startDate > this.newRequest.endDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'La date de fin ne peut pas être avant la date de début'
      });
      return false;
    }
    return true;
  }

  resetForm() {
    this.newRequest = {
      type: undefined,
      urgencyLevel: 'NORMAL',
      startDate: null,
      endDate: null,
      reason: '',
      status: 'EN_ATTENTE'
    };
    this.dateRange = [];
  }

  onDateSelect(event: any) {
    if (this.dateRange && this.dateRange.length === 2) {
      this.newRequest.startDate = this.dateRange[0];
      this.newRequest.endDate = this.dateRange[1];
    }
  }

  submitRequest() {
    this.onSubmit();
  }

  private loadConges() {
    this.congeService.getConges(1).subscribe({
      next: (conges) => {
        this.conges = conges as CongeRequest[];
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les congés'
        });
      }
    });
  }

  private loadCongeBalance() {
    this.congeService.getCongeBalance(1).subscribe({
      next: (balance) => {
        this.congeBalance = balance;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger le solde de congé'
        });
      }
    });
  }

  private calculateDuration(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  getStatusLabel(status: CongeStatus): string {
    switch (status) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'APPROUVE':
        return 'Approuvé';
      case 'REFUSE':
        return 'Refusé';
      default:
        return status;
    }
  }

  getStatusClass(status: CongeStatus): string {
    switch (status) {
      case 'APPROUVE':
        return 'status-approved';
      case 'REFUSE':
        return 'status-rejected';
      case 'EN_ATTENTE':
        return 'status-pending';
      default:
        return '';
    }
  }

  cancelRequest(id: number) {
    if (!id) return;

    this.congeService.cancelCongeRequest(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Demande annulée avec succès'
        });
        this.loadConges();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible d\'annuler la demande'
        });
      }
    });
  }
}
