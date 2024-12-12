import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: environment.openAIApiKey,
      dangerouslyAllowBrowser: true
    });
  }

  generateResponse(prompt: string): Observable<string> {
    return from(
      this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150
      })
    ).pipe(
      map(response => response.choices[0]?.message?.content?.trim() || 'Lo siento, no pude generar una respuesta.'),
      catchError(error => {
        console.error('Error in AI service:', error);
        return of('Has alcanzado el limite mensual de tokens.');
      })
    );
  }
}
