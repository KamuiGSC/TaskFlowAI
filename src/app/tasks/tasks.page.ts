import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { TaskService, Task } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { AIChatComponent } from '../components/ai-chat/ai-chat.component';

@Component({
  selector: 'app-tasks',
  template: `
    <ion-content>
      <div class="layout">
        <app-sidebar></app-sidebar>
        <div class="main-content">
          <div class="tasks-header">
            <div class="tabs">
              <button class="tab" [class.active]="activeTab === 'all'" (click)="setActiveTab('all')">TODAS</button>
              <button class="tab" [class.active]="activeTab === 'todo'" (click)="setActiveTab('todo')">POR HACER</button>
              <button class="tab" [class.active]="activeTab === 'doing'" (click)="setActiveTab('doing')">EN PROGRESO</button>
              <button class="tab" [class.active]="activeTab === 'done'" (click)="setActiveTab('done')">COMPLETADAS</button>
            </div>
            <button class="add-task-btn" (click)="openAddTaskModal()">+ Añadir nueva tarea</button>
          </div>
          <div class="tasks-grid">
            <div class="task-item" *ngFor="let task of filteredTasks">
              <h3>{{ task.title }}</h3>
              <p>{{ task.description }}</p>
              <div class="task-meta">
                <span class="priority" [class]="task.priority">{{ task.priority }}</span>
                <span class="status" [class]="task.status">{{ task.status }}</span>
              </div>
              <div class="task-actions">
                <button (click)="editTask(task)">Editar</button>
                <button (click)="deleteTask(task.id)">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button (click)="openAIChat()">
            <ion-icon name="chatbubbles-outline"></ion-icon>
          </ion-fab-button>
        </ion-fab>
        <app-ai-chat [isOpen]="isAIChatOpen" (closeChat)="closeAIChat()"></app-ai-chat>
      </div>
    </ion-content>

    <ion-modal [isOpen]="isModalOpen">
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ isEditing ? 'Editar Tarea' : 'Añadir Nueva Tarea' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="closeModal()">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <form (ngSubmit)="submitTask()">
            <ion-item>
              <ion-label position="floating">Título</ion-label>
              <ion-input [(ngModel)]="currentTask.title" name="title" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Descripción</ion-label>
              <ion-textarea [(ngModel)]="currentTask.description" name="description" required></ion-textarea>
            </ion-item>
            <ion-item>
              <ion-label>Prioridad</ion-label>
              <ion-select [(ngModel)]="currentTask.priority" name="priority">
                <ion-select-option value="low">Baja</ion-select-option>
                <ion-select-option value="medium">Media</ion-select-option>
                <ion-select-option value="high">Alta</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-label>Estado</ion-label>
              <ion-select [(ngModel)]="currentTask.status" name="status">
                <ion-select-option value="todo">Por hacer</ion-select-option>
                <ion-select-option value="doing">En progreso</ion-select-option>
                <ion-select-option value="done">Completada</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-button expand="block" type="submit">{{ isEditing ? 'Actualizar' : 'Crear' }} Tarea</ion-button>
          </form>
        </ion-content>
      </ng-template>
    </ion-modal>
  `,
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SidebarComponent, AIChatComponent]
})
export class TasksPage implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  activeTab: 'all' | 'todo' | 'doing' | 'done' = 'all';
  isModalOpen = false;
  isEditing = false;
  currentTask: Partial<Task> = {};
  private tasksSubscription: Subscription | undefined;
  isAIChatOpen = false;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.getCurrentUserId()) {
      this.router.navigate(['/auth']);
    } else {
      this.tasksSubscription = this.taskService.getTasks().subscribe(tasks => {
        this.tasks = tasks;
        this.filterTasks();
      });
    }
  }

  ngOnDestroy() {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  setActiveTab(tab: 'all' | 'todo' | 'doing' | 'done') {
    this.activeTab = tab;
    this.filterTasks();
  }

  filterTasks() {
    if (this.activeTab === 'all') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task => task.status === this.activeTab);
    }
  }

  openAddTaskModal() {
    this.isEditing = false;
    this.currentTask = {};
    this.isModalOpen = true;
  }

  editTask(task: Task) {
    this.isEditing = true;
    this.currentTask = { ...task };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitTask() {
    if (this.isEditing && this.currentTask.id) {
      this.taskService.updateTask(this.currentTask as Task);
    } else {
      this.taskService.addTask(this.currentTask as Omit<Task, 'id' | 'createdAt' | 'userId'>);
    }
    this.closeModal();
  }

  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId);
  }

  openAIChat() {
    this.isAIChatOpen = true;
  }

  closeAIChat() {
    this.isAIChatOpen = false;
  }
}
