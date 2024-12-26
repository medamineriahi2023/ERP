import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Tableau de Bord</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <p-card styleClass="h-full">
          <div class="text-center">
            <i class="pi pi-clock text-4xl text-primary-500 mb-4"></i>
            <h2 class="text-xl font-semibold mb-2">Pointage</h2>
            <p class="text-gray-600 mb-4">Gérez vos entrées et sorties</p>
            <button pButton label="Accéder" routerLink="/pointage"></button>
          </div>
        </p-card>
        
        <p-card styleClass="h-full">
          <div class="text-center">
            <i class="pi pi-calendar text-4xl text-primary-500 mb-4"></i>
            <h2 class="text-xl font-semibold mb-2">Congés</h2>
            <p class="text-gray-600 mb-4">Gérez vos demandes de congés</p>
            <button pButton label="Accéder" routerLink="/conges"></button>
          </div>
        </p-card>
        
        <p-card styleClass="h-full">
          <div class="text-center">
            <i class="pi pi-users text-4xl text-primary-500 mb-4"></i>
            <h2 class="text-xl font-semibold mb-2">Employés</h2>
            <p class="text-gray-600 mb-4">Gérez les informations du personnel</p>
            <button pButton label="Accéder" routerLink="/employes"></button>
          </div>
        </p-card>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule]
})
export class DashboardComponent {}
