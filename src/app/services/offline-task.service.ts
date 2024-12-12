import { Injectable } from '@angular/core';
import { openDB } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class OfflineTaskService {
  private dbPromise = openDB('TasksDB', 1, {
    upgrade(db) {
      db.createObjectStore('pendingTasks', { keyPath: 'id', autoIncrement: true });
    }
  });

  async addTask(task: any) {
    // Si hay conexión, envía a backend
    if (navigator.onLine) {
      await this.sendTaskToBackend(task);
    } else {
      // Guarda en IndexedDB para sincronizar después
      const db = await this.dbPromise;
      await db.add('pendingTasks', task);
    }
  }

  async syncPendingTasks() {
    if (navigator.onLine) {
      const db = await this.dbPromise;
      const pendingTasks = await db.getAll('pendingTasks');

      for (const task of pendingTasks) {
        await this.sendTaskToBackend(task);
        await db.delete('pendingTasks', task.id);
      }
    }
  }

  private async sendTaskToBackend(task: any) {
    // Lógica para enviar tarea al backend
  }
}
