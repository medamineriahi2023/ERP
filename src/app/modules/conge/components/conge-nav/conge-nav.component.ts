import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-conge-nav',
  template: `
    <nav class="flex gap-4 mb-4">
      <button pButton 
              [routerLink]="['/conge/dashboard']" 
              routerLinkActive="p-button-primary" 
              label="Tableau de bord">
      </button>
      <button pButton 
              [routerLink]="['/conge/calendrier']" 
              routerLinkActive="p-button-primary" 
              label="Calendrier">
      </button>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 1rem;
    }
    .p-button-primary {
      background-color: var(--primary-color);
      color: var(--primary-color-text);
    }
  `],
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule]
})
export class CongeNavComponent {}
