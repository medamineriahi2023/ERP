import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ChipModule } from 'primeng/chip';
import { TimelineModule } from 'primeng/timeline';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Employee, EmployeeService } from '../../../../shared/services/employee.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

interface TimelineEvent {
  status: string;
  date: Date;
  icon: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    ChipModule,
    TimelineModule,
    AvatarModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    EmployeeFormComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './employee-detail.component.html'
})
export class EmployeeDetailComponent implements OnInit {
  employee?: Employee;
  showEditDialog = false;
  events: TimelineEvent[] = [];
  activeTabIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadEmployee(id);
    }
  }

  private loadEmployee(id: number) {
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        if (employee) {
          this.employee = employee;
          this.generateTimelineEvents();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Employé non trouvé'
          });
          this.router.navigate(['/employees']);
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les informations de l\'employé'
        });
      }
    });
  }

  private generateTimelineEvents() {
    if (!this.employee) return;

    this.events = [
      {
        status: 'Recrutement',
        date: this.employee.joinDate,
        icon: 'pi pi-user-plus',
        color: '#22C55E',
        description: `A rejoint l'entreprise en tant que ${this.employee.position}`
      }
      // Add more events based on employee history
    ];
  }

  onEdit() {
    this.showEditDialog = true;
  }

  onSave(updates: Partial<Employee>) {
    if (this.employee) {
      this.employeeService.updateEmployee(this.employee.id, updates).subscribe({
        next: (updated) => {
          this.employee = updated;
          this.showEditDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Informations mises à jour'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour les informations'
          });
        }
      });
    }
  }

  onDelete() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cet employé ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.employee) {
          this.employeeService.deleteEmployee(this.employee.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Employé supprimé'
              });
              this.router.navigate(['/employees']);
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer l\'employé'
              });
            }
          });
        }
      }
    });
  }

  getStatusSeverity(status: Employee['status']): 'success' | 'secondary' | 'info' | 'warn' | 'danger' {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'danger';
      case 'ON_LEAVE':
        return 'warn';
      case 'PENDING':
        return 'info';
      default:
        return 'secondary';
    }
  }

  getStatusLabel(status: Employee['status']): string {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'INACTIVE': return 'Inactif';
      case 'ON_LEAVE': return 'En congé';
      default: return status;
    }
  }
}
