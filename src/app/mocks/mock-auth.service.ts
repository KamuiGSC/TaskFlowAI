import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  login(email: string, password: string): Promise<any> {
    return Promise.resolve({ user: { uid: 'testUID', email: email } });
  }

  register(email: string, password: string, nombre: string, apellidos: string, telefono: string): Promise<any> {
    return Promise.resolve({ user: { uid: 'testUID', email: email } });
  }

  logout(): Promise<void> {
    return Promise.resolve();
  }

  getCurrentUser(): any {
    return { uid: 'testUID', email: 'test@example.com' };
  }
}
