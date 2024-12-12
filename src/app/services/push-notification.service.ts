import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  async requestPermission() {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      // Registro de service worker para push
      const registration = await navigator.serviceWorker.ready;

      // Aquí iría la lógica de suscripción a un servicio de push (Firebase, por ejemplo)
    }
  }

  sendLocalNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
}
