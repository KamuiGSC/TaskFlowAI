import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Task {
  id: string;
  userId: string | null;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done';
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor(private authService: AuthService) {}

  getTasks(): Observable<Task[]> {
    const userId = this.authService.getCurrentUserId();
    const userTasks = this.tasks.filter(task => task.userId === userId);
    this.tasksSubject.next(userTasks);
    return this.tasksSubject.asObservable();
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'userId'>): void {
    const userId = this.authService.getCurrentUserId();
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      userId: userId
    };
    this.tasks.push(newTask);
    this.getTasks(); // This will update the tasksSubject with the new task list
  }

  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id && task.userId === updatedTask.userId);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.getTasks(); // This will update the tasksSubject with the updated task list
    }
  }

  deleteTask(taskId: string): void {
    const userId = this.authService.getCurrentUserId();
    this.tasks = this.tasks.filter(task => !(task.id === taskId && task.userId === userId));
    this.getTasks(); // This will update the tasksSubject with the new task list
  }
}
