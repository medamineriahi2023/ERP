import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterModule, MenuModule, ButtonModule]
})
export class NavbarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Mon Profil',
      icon: 'pi pi-user',
      command: () => {
        // Handle profile click
      }
    },
    {
      label: 'Paramètres',
      icon: 'pi pi-cog',
      command: () => {
        // Handle settings click
      }
    },
    {
      separator: true
    },
    {
      label: 'Déconnexion',
      icon: 'pi pi-power-off',
      command: () => {
        // Handle logout click
      }
    }
  ];

  constructor(private router: Router) {}
}
