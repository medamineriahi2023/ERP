import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CongesService, Demande, CongeStats } from '../../../../shared/services/conges.service';

@Component({
  selector: 'app-liste-conges',
  templateUrl: './liste-conges.component.html',
  styleUrls: ['./liste-conges.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class ListeCongesComponent implements OnInit {
  demandes: Demande[] = [];
  loading: boolean = true;
  displayDialog: boolean = false;
  selectedDemande: Demande | null = null;
  
  congesAnnuels: CongeStats = {
    joursDisponibles: 0,
    joursAccumules: 0
  };

  congesMaladie: CongeStats = {
    joursDisponibles: 0,
    joursAccumules: 0
  };

  get historiqueDemandes(): Demande[] {
    return this.demandes;
  }

  get demandesEnCours(): number {
    return this.demandes.filter(d => d.statut === 'En Attente').length;
  }

  constructor(
    private congesService: CongesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadDemandesConges();
    this.loadCongesStats();
  }

  loadDemandesConges() {
    this.loading = true;
    this.congesService.getDemandesConges().subscribe({
      next: (data) => {
        this.demandes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les demandes de congés'
        });
        this.loading = false;
      }
    });
  }

  loadCongesStats() {
    this.congesService.getCongeStats().subscribe({
      next: (stats) => {
        this.congesAnnuels = stats;
        // For now, we'll use the same stats for sick leave
        this.congesMaladie = {
          joursDisponibles: 5,
          joursAccumules: 0
        };
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les statistiques de congés'
        });
      }
    });
  }

  applyFilterGlobal($event: any, stringVal: string) {
    if ($event?.target) {
      const table = document.querySelector('p-table');
      if (table) {
        (table as any).filterGlobal(($event.target as HTMLInputElement).value, stringVal);
      }
    }
  }

  viewDetails(demande: Demande) {
    this.selectedDemande = demande;
    this.displayDialog = true;
  }

  cancelDemande(demande: Demande) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir annuler cette demande de congé ?',
      accept: () => {
        if (demande.id) {
          this.congesService.annulerDemandeConge(demande.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'La demande a été annulée avec succès'
              });
              this.loadDemandesConges();
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Impossible d'annuler la demande"
              });
            }
          });
        }
      }
    });
  }
}
