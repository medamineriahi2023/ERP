import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextarea } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CongeNavComponent } from '../conge-nav/conge-nav.component';
import { CongeService, CongeRequest } from '../../../../shared/services/conge.service';

@Component({
  selector: 'app-validation-conge',
  templateUrl: './validation-conge.component.html',
  styleUrls: ['./validation-conge.component.scss'],
  standalone: false,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextarea,
    ToastModule,
    ConfirmDialogModule,
    AvatarModule,
    TagModule,
    DropdownModule,
    CongeNavComponent
  ],
  providers: [MessageService, ConfirmationService]
})
export class ValidationCongeComponent implements OnInit {
  conges: CongeRequest[] = [];
  typeFilter = signal<string | null>(null);
  statusFilter = signal<string | null>(null);
  selectedConge: CongeRequest | null = null;
  approverComment = '';
  loading = true;
  
  // Add dialog visibility state
  isValidationDialogVisible = false;

  types = [
    { label: 'Congé payé', value: 'CONGE_PAYE' },
    { label: 'Maladie', value: 'MALADIE' },
    { label: 'Formation', value: 'FORMATION' },
    { label: 'Événement familial', value: 'EVENEMENT_FAMILIAL' },
    { label: 'Autre', value: 'AUTRE' }
  ];

  statuses = [
    { label: 'En Attente', value: 'EN_ATTENTE' },
    { label: 'Approuvé', value: 'APPROUVE' },
    { label: 'Refusé', value: 'REFUSE' }
  ];

  constructor(
    private congeService: CongeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadConges();
  }

  private loadConges() {
    this.loading = true;
    // Dans un cas réel, nous chargerions les congés à valider pour le manager connecté
    this.congeService.getConges(0).subscribe(
      (conges) => {
        this.conges = conges;
        this.loading = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les demandes de congés'
        });
        this.loading = false;
      }
    );
  }

  openValidationDialog(conge: CongeRequest) {
    this.selectedConge = conge;
    this.approverComment = '';
    this.isValidationDialogVisible = true;
  }

  validateConge(approved: boolean) {
    if (!this.selectedConge) return;

    const updates: Partial<CongeRequest> = {
      status: approved ? 'APPROUVE' : 'REFUSE',
      approverComment: this.approverComment,
      updatedAt: new Date()
    };

    this.congeService.updateCongeRequest(this.selectedConge.id, updates).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success', 
          summary: 'Succès', 
          detail: `Demande de congé ${approved ? 'approuvée' : 'refusée'}`
        });
        this.loadConges();
        this.isValidationDialogVisible = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error', 
          summary: 'Erreur', 
          detail: 'Impossible de mettre à jour la demande'
        });
      }
    });
  }

  confirmValidation(approved: boolean) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir ${approved ? 'approuver' : 'refuser'} cette demande de congé ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.validateConge(approved);
      }
    });
  }

  filter(value: string | null, filterType: 'type' | 'status') {
    if (filterType === 'type') {
      this.typeFilter.set(value);
    } else {
      this.statusFilter.set(value);
    }
    // Implement additional filtering logic if needed
  }

  getStatusSeverity(status: 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE'): 'success' | 'info' | 'danger' | 'warn' {
    switch (status) {
      case 'APPROUVE': return 'success';
      case 'REFUSE': return 'danger';
      case 'EN_ATTENTE': return 'warn';
      default: return 'info';
    }
  }

  getStatusLabel(status: 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE'): string {
    switch (status) {
      case 'APPROUVE': return 'Approuvé';
      case 'REFUSE': return 'Refusé';
      case 'EN_ATTENTE': return 'En attente';
      default: return status;
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'CONGE_PAYE': return 'Congé payé';
      case 'MALADIE': return 'Maladie';
      case 'FORMATION': return 'Formation';
      case 'SANS_SOLDE': return 'Sans solde';
      default: return 'Autre';
    }
  }

  calculateDaysUntilStart(startDate: Date): number {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = start.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isUrgent(conge: CongeRequest): boolean {
    return this.calculateDaysUntilStart(conge.startDate) <= 7 && conge.status === 'EN_ATTENTE';
  }
}
