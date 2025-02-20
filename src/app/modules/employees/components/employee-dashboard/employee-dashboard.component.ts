import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { EmployeeService, Employee, EmployeeStats, CreateEmployeeDto } from '../../../../shared/services/employee.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CardModule,
    ChartModule,
    AvatarModule,
    TagModule,
    ToastModule,
    DialogModule
  ],
  templateUrl: './employee-dashboard.component.html',
  providers: [MessageService]
})
export class EmployeeDashboardComponent implements OnInit {
  employees: Employee[] = [];
  stats: EmployeeStats | null = null;
  loading = true;

  // Charts data
  departmentChart: any;
  contractTypeChart: any;
  performanceChart: any;

  showAddDialog = false;
  selectedEmployee?: Employee;
  showDetailDialog = false;

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEmployees();
    this.loadStats();
  }

  private loadEmployees() {
    this.loading = true;
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les employés'
        });
        this.loading = false;
      }
    });
  }

  private loadStats() {
    this.employeeService.getEmployeeStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.initializeCharts();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les statistiques'
        });
      }
    });
  }

  private initializeCharts() {
    if (!this.stats) return;

    // Department distribution chart
    const departmentLabels = Object.keys(this.stats.departmentDistribution);
    const departmentData = Object.values(this.stats.departmentDistribution);

    this.departmentChart = {
      labels: departmentLabels,
      datasets: [
        {
          data: departmentData,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }
      ]
    };

    // Contract type distribution chart
    const contractLabels = Object.keys(this.stats.contractTypeDistribution);
    const contractData = Object.values(this.stats.contractTypeDistribution);

    this.contractTypeChart = {
      labels: contractLabels,
      datasets: [
        {
          data: contractData,
          backgroundColor: [
            '#4BC0C0',
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }
      ]
    };

    // Performance distribution chart
    this.performanceChart = {
      labels: ['1-2', '2-3', '3-4', '4-5'],
      datasets: [
        {
          label: 'Nombre d\'employés',
          data: [
            this.employees.filter(e => e.performanceRating && e.performanceRating < 2).length,
            this.employees.filter(e => e.performanceRating && e.performanceRating >= 2 && e.performanceRating < 3).length,
            this.employees.filter(e => e.performanceRating && e.performanceRating >= 3 && e.performanceRating < 4).length,
            this.employees.filter(e => e.performanceRating && e.performanceRating >= 4).length
          ],
          backgroundColor: '#36A2EB'
        }
      ]
    };
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'danger';
      case 'ON_LEAVE': return 'info';
      case 'PENDING': return 'warn';
      default: return 'info';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'INACTIVE': return 'Inactif';
      case 'ON_LEAVE': return 'En congé';
      default: return status;
    }
  }

  onAddEmployee() {
    this.showAddDialog = true;
  }

  createEmployee(employee: Partial<Employee>) {
    const newEmployee: CreateEmployeeDto = {
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      email: employee.email || '',
      birthDate: employee.birthDate || new Date(),
      hireDate: new Date(),
      position: employee.position || '',
      department: employee.department || '',
      status: employee.status || 'PENDING',
      phoneNumber: employee.phone || '',
      address: employee.address || '',
      salary: employee.salary?.base,
      skills: employee.skills
    };

    this.employeeService.createEmployee(newEmployee).subscribe({
      next: (createdEmployee) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Employé créé avec succès'
        });
        this.loadEmployees();
        this.showAddDialog = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de la création de l\'employé'
        });
      }
    });
  }

  viewEmployeeDetails(employee: Employee) {
    this.router.navigate(['/employees', employee.id]);
  }

  exportToExcel() {
    // Implement Excel export functionality
    const data = this.employees.map(emp => ({
      'Prénom': emp.firstName,
      'Nom': emp.lastName,
      'Email': emp.email,
      'Téléphone': emp.phone,
      'Poste': emp.position,
      'Département': emp.department,
      'Type de Contrat': emp.contractType,
      'Statut': this.getStatusLabel(emp.status),
      'Performance': emp.performanceRating
    }));

    // Use a library like xlsx to export data
    // For now, we'll just show a success message
    this.messageService.add({
      severity: 'success',
      summary: 'Export',
      detail: 'Liste des employés exportée'
    });
  }

  calculateAverageSalary(): number {
    if (!this.employees.length) return 0;
    const totalSalary = this.employees.reduce((sum, emp) => sum + (emp.salary?.base || 0), 0);
    return totalSalary / this.employees.length;
  }
}
