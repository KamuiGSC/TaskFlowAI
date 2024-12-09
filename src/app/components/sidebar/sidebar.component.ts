// src/app/components/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="user-profile" routerLink="/profile">
        <img [src]="user?.photoURL || 'assets/user.png'" alt="Usuario" class="user-avatar">
        <span class="user-name">{{ user?.displayName || 'Usuario' }}</span>
      </div>

      <nav class="nav-menu">
        <a routerLink="/welcome" routerLinkActive="active" class="nav-item">
          <ion-icon name="home-outline"></ion-icon>
          <span>Inicio</span>
        </a>
        <a routerLink="/tasks" routerLinkActive="active" class="nav-item">
          <ion-icon name="list-outline"></ion-icon>
          <span>Tareas</span>
        </a>
        <a routerLink="/statistics" routerLinkActive="active" class="nav-item">
          <ion-icon name="bar-chart-outline"></ion-icon>
          <span>Estadísticas</span>
        </a>
      </nav>

      <div class="ai-toggle">
        <ion-icon name="bulb-outline"></ion-icon>
      </div>
    </div>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  user: any;

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }
}
