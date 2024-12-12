import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-statistics',
  template: `
    <ion-content class="ion-padding statistics-container">
      <div class="layout">
        <div class="sidebar-wrapper">
          <app-sidebar></app-sidebar>
        </div>
        <div class="main-content-wrapper">
          <div class="main-content">
            <h1>Estadísticas de Tareas</h1>

            <ion-card>
              <ion-card-header>
                <ion-card-title>Resumen de Tareas</ion-card-title>
                <ion-card-subtitle>Distribución de tareas por estado</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-label>Por hacer</ion-label>
                    <ion-progress-bar [value]="getProgressValue(statistics?.tasksByStatus.todo, statistics?.totalTasks)" color="primary"></ion-progress-bar>
                    <ion-note slot="end">{{statistics?.tasksByStatus.todo || 0}}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label>En progreso</ion-label>
                    <ion-progress-bar [value]="getProgressValue(statistics?.tasksByStatus.doing, statistics?.totalTasks)" color="secondary"></ion-progress-bar>
                    <ion-note slot="end">{{statistics?.tasksByStatus.doing || 0}}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label>Completadas</ion-label>
                    <ion-progress-bar [value]="getProgressValue(statistics?.tasksByStatus.done, statistics?.totalTasks)" color="tertiary"></ion-progress-bar>
                    <ion-note slot="end">{{statistics?.tasksByStatus.done || 0}}</ion-note>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>

            <ion-card>
              <ion-card-header>
                <ion-card-title>Tareas por Prioridad</ion-card-title>
                <ion-card-subtitle>Distribución de tareas según su prioridad</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-label>Alta</ion-label>
                    <ion-progress-bar [value]="getProgressValue(statistics?.tasksByPriority.high, statistics?.totalTasks)" color="danger"></ion-progress-bar>
                    <ion-note slot="end">{{statistics?.tasksByPriority.high || 0}}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label>Media</ion-label>
                    <ion-progress-bar [value]="getProgressValue(statistics?.tasksByPriority.medium, statistics?.totalTasks)" color="warning"></ion-progress-bar>
                    <ion-note slot="end">{{statistics?.tasksByPriority.medium || 0}}</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label>Baja</ion-label>
                    <ion-progress-bar [value]="getProgressValue(statistics?.tasksByPriority.low, statistics?.totalTasks)" color="success"></ion-progress-bar>
                    <ion-note slot="end">{{statistics?.tasksByPriority.low || 0}}</ion-note>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>

            <ion-card>
              <ion-card-header>
                <ion-card-title>Progreso General</ion-card-title>
                <ion-card-subtitle>Tareas completadas vs pendientes</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-progress-bar [value]="getProgressValue(statistics?.completedTasks, statistics?.totalTasks)" color="success"></ion-progress-bar>
                <ion-text color="success">
                  <p>Completadas: {{statistics?.completedTasks || 0}} ({{getPercentage(statistics?.completedTasks, statistics?.totalTasks)}}%)</p>
                </ion-text>
                <ion-text color="medium">
                  <p>Pendientes: {{statistics?.pendingTasks || 0}} ({{getPercentage(statistics?.pendingTasks, statistics?.totalTasks)}}%)</p>
                </ion-text>
              </ion-card-content>
            </ion-card>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./statistics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, SidebarComponent]
})
export class StatisticsPage implements OnInit {
  statistics: any;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTaskStatistics().subscribe(
      stats => {
        this.statistics = stats;
      },
      error => {
        console.error('Error fetching statistics:', error);
      }
    );
  }

  getProgressValue(value: number, total: number): number {
    return total > 0 ? value / total : 0;
  }

  getPercentage(value: number, total: number): string {
    return total > 0 ? ((value / total) * 100).toFixed(1) : '0';
  }
}
