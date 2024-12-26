import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MenuModule]
})
export class SidebarComponent {
  items: MenuItem[] = [
    {
      label: 'Tableau de bord',
      icon: 'pi pi-home',
      routerLink: ['/dashboard']
    },
    {
      label: 'Employés',
      icon: 'pi pi-users',
      items: [
        {
          label: 'Liste des employés',
          icon: 'pi pi-list',
          routerLink: ['/employees']
        },
        {
          label: 'Évaluations',
          icon: 'pi pi-chart-line',
          routerLink: ['/employees/reviews']
        },
        {
          label: 'Formations',
          icon: 'pi pi-book',
          routerLink: ['/employees/trainings']
        }
      ]
    },
    {
      label: 'Pointage',
      icon: 'pi pi-clock',
      items: [
        {
          label: 'Tableau de bord',
          icon: 'pi pi-chart-bar',
          routerLink: ['/pointage/dashboard']
        },
        {
          label: 'Enregistrer',
          icon: 'pi pi-check-circle',
          routerLink: ['/pointage/record']
        },
        {
          label: 'Historique',
          icon: 'pi pi-history',
          routerLink: ['/pointage/history']
        },
        {
          label: 'Rapports',
          icon: 'pi pi-file',
          routerLink: ['/pointage/reports']
        }
      ]
    },
    {
      label: 'Congés',
      icon: 'pi pi-calendar',
      items: [
        {
          label: 'Tableau de bord',
          icon: 'pi pi-chart-bar',
          routerLink: ['/conge/dashboard']
        },
        {
          label: 'Demandes',
          icon: 'pi pi-list',
          routerLink: ['/conge/requests']
        },
        {
          label: 'Calendrier',
          icon: 'pi pi-calendar',
          routerLink: ['/conge/calendar']
        }
      ]
    },
    {
      label: 'Paramètres',
      icon: 'pi pi-cog',
      routerLink: ['/parametres']
    }
  ];
}
