import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIService } from '../../services/ai.service';

interface Message {
  content: string;
  isUser: boolean;
}

@Component({
  selector: 'app-ai-chat',
  template: `
    <ion-modal [isOpen]="isOpen" (ionModalDidDismiss)="close()">
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-title>Chat IA</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="close()">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="chat-messages">
            <div *ngFor="let message of messages"
                 [ngClass]="message.isUser ? 'user-message' : 'ai-message'">
              {{ message.content }}
            </div>
            <div *ngIf="isLoading" class="loading-message">
              Generando respuesta...
            </div>
          </div>
        </ion-content>

        <ion-footer>
          <ion-toolbar>
            <ion-input
              [(ngModel)]="userMessage"
              placeholder="Escribe tu mensaje"
              (keyup.enter)="sendMessage()">
            </ion-input>
            <ion-button
              slot="end"
              (click)="sendMessage()"
              [disabled]="!userMessage.trim() || isLoading">
              Enviar
            </ion-button>
          </ion-toolbar>
        </ion-footer>
      </ng-template>
    </ion-modal>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AIChatComponent {
  @Input() isOpen = false;
  @Output() closeChat = new EventEmitter<void>();

  userMessage = '';
  messages: Message[] = [];
  isLoading = false;

  constructor(private aiService: AIService) {}

  close() {
    this.closeChat.emit();
  }

  sendMessage() {
    if (this.userMessage.trim() && !this.isLoading) {
      this.isLoading = true;
      const currentMessage = this.userMessage;

      // Añadir mensaje del usuario
      this.messages.push({ content: currentMessage, isUser: true });

      // Llamar al servicio de IA
      this.aiService.generateResponse(currentMessage).subscribe({
        next: (response) => {
          // Añadir respuesta de la IA
          this.messages.push({ content: response, isUser: false });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al obtener respuesta de la IA:', error);
          this.messages.push({
            content: 'Has alcanzado el limite mensual de tokens.',
            isUser: false
          });
          this.isLoading = false;
        }
      });

      // Limpiar el mensaje del usuario
      this.userMessage = '';
    }
  }
}
