import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from '@angular/fire/firestore';
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

  constructor(private firestore: Firestore, private authService: AuthService) {}

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

  getTaskStatistics(): Observable<any> {
    return of(this.authService.getCurrentUserId()).pipe(
      switchMap(uid => {
        if (!uid) throw new Error('No user logged in');
        return from(this.getTasksFromFirestore(uid));
      }),
      map(tasks => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'done').length;
        const pendingTasks = totalTasks - completedTasks;

        const tasksByPriority = {
          high: tasks.filter(task => task.priority === 'high').length,
          medium: tasks.filter(task => task.priority === 'medium').length,
          low: tasks.filter(task => task.priority === 'low').length
        };

        const tasksByStatus = {
          todo: tasks.filter(task => task.status === 'todo').length,
          doing: tasks.filter(task => task.status === 'doing').length,
          done: completedTasks
        };

        return {
          totalTasks,
          completedTasks,
          pendingTasks,
          tasksByPriority,
          tasksByStatus
        };
      })
    );
  }

  private async getTasksFromFirestore(userId: string): Promise<Task[]> {
    const tasksRef = collection(this.firestore, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data['createdAt'].toDate()
      } as Task;
    });
  }
}
