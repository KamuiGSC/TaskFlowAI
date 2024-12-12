import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SwUpdate, } from '@angular/service-worker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, CommonModule],
  template: `
    <div *ngIf="updateAvailable">
      Hay una nueva versión disponible.
      <button (click)="updateApp()">Actualizar</button>
    </div>
    <div *ngIf="canInstall">
      <button (click)="installPWA()">Instalar Aplicación</button>
    </div>
  `
})
export class AppComponent implements OnInit{
  updateAvailable = false;
  canInstall = false;
  deferredPrompt: any;

  title = 'Your App Name';
  constructor(private swUpdate: SwUpdate) {}

  ngOnInit() {
    // Verificar actualizaciones
    if (this.swUpdate.isEnabled) {
      this.checkForUpdates();
    }

    // Manejar instalación de PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.canInstall = true;
    });

    // Manejar instalación completada
    window.addEventListener('appinstalled', (event) => {
      console.log('PWA instalada');
      this.canInstall = false;
    });
  }

  checkForUpdates() {
    this.swUpdate.checkForUpdate().then(
      (updateFound) => {
        if (updateFound) {
          this.updateAvailable = true;
        }
      },
      (error) => {
        console.error('Error checking for updates', error);
      }
    );
  }

  updateApp() {
    this.swUpdate.activateUpdate().then(() => {
      document.location.reload();
    });
  }

  async installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('Usuario aceptó la instalación');
      } else {
        console.log('Usuario rechazó la instalación');
      }

      this.deferredPrompt = null;
      this.canInstall = false;
    }
  }
}
