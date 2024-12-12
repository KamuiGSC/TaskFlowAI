/* import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  template: `
    <div class="sidebar-container">
      <!-- Botón para mostrar/ocultar la barra lateral -->
      <div class="toggle-button" (click)="toggleSidebar()">
        <ion-icon name="menu-outline"></ion-icon>
      </div>

      <!-- Barra lateral (visible solo si no está colapsada) -->
      <div class="sidebar" *ngIf="!isCollapsed">
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
      </div>
    </div>
  `,
styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  user: any;
  isCollapsed: boolean = true; // Estado inicial: colapsado

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  // Alternar entre expandido y colapsado
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
} */


  import { Component, OnInit, OnDestroy } from '@angular/core';
  import { IonicModule } from '@ionic/angular';
  import { CommonModule } from '@angular/common';
  import { Router, NavigationEnd, RouterModule } from '@angular/router';
  import { AuthService } from '../../services/auth.service';
  import { Subscription } from 'rxjs';
  import { filter } from 'rxjs/operators';

  @Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [IonicModule, CommonModule, RouterModule],
    template: `
      <div class="sidebar-container">
        <!-- Botón para mostrar/ocultar la barra lateral -->
        <div class="toggle-button" (click)="toggleSidebar()">
          <ion-icon name="menu-outline"></ion-icon>
        </div>

        <!-- Barra lateral (visible solo si no está colapsada) -->
        <div class="sidebar" *ngIf="!isCollapsed">
          <div class="user-profile" routerLink="/profile" (click)="collapseSidebar()">
            <img [src]="user?.photoURL || 'assets/user.png'" alt="Usuario" class="user-avatar">
            <span class="user-name">{{ user?.displayName || 'Usuario' }}</span>
          </div>

          <nav class="nav-menu">
            <a routerLink="/welcome" routerLinkActive="active" class="nav-item" (click)="collapseSidebar()">
              <ion-icon name="home-outline"></ion-icon>
              <span>Inicio</span>
            </a>
            <a routerLink="/tasks" routerLinkActive="active" class="nav-item" (click)="collapseSidebar()">
              <ion-icon name="list-outline"></ion-icon>
              <span>Tareas</span>
            </a>
            <a routerLink="/statistics" routerLinkActive="active" class="nav-item" (click)="collapseSidebar()">
              <ion-icon name="bar-chart-outline"></ion-icon>
              <span>Estadísticas</span>
            </a>
          </nav>
        </div>
      </div>
    `,
    styleUrls: ['./sidebar.component.scss']
  })
  export class SidebarComponent implements OnInit, OnDestroy {
    user: any;
    isCollapsed: boolean = true; // Estado inicial: colapsado
    private routerSubscription: Subscription | undefined;

    constructor(private authService: AuthService, private router: Router) {
      this.authService.user$.subscribe(user => {
        this.user = user;
      });
    }

    ngOnInit() {
      this.routerSubscription = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.isCollapsed = true;
      });
    }

    ngOnDestroy() {
      if (this.routerSubscription) {
        this.routerSubscription.unsubscribe();
      }
    }

    // Alternar entre expandido y colapsado
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    }

    // Colapsar el sidebar
    collapseSidebar() {
      this.isCollapsed = true;
    }
  }
