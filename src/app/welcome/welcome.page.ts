// src/app/welcome/welcome.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-welcome',
  template: `
    <ion-content>
      <div class="layout">
        <app-sidebar></app-sidebar>
        <div class="main-content">
          <div class="welcome-container">
            <img src="assets/task-icon.png" alt="Task Manager" class="welcome-logo">
            <h1>Task Manager</h1>
            <h2>Un manejador de tareas</h2>
            <p class="welcome-text">
              Bienvenido a Task Manager, tu solución integral para la gestión de tareas.
              Organiza, prioriza y completa tus tareas de manera eficiente.
            </p>
            <ion-button expand="block" (click)="goToTasks()" class="start-button">
              Comenzar a gestionar tareas
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, SidebarComponent]
})
export class WelcomePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Verificar si ya se mostró la pantalla de bienvenida
    const welcomeShown = localStorage.getItem('welcomeShown');
    if (welcomeShown) {
      this.router.navigate(['/welcome']);
    }
  }

  goToTasks() {
    localStorage.setItem('welcomeShown', 'true');
    this.router.navigate(['/welcome']);
  }
}
