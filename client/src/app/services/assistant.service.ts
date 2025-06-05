import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  private baseUrl = 'http://localhost:3000/api/chat';

  constructor(private http: HttpClient) {}

  sendMessage(courseId: number, message: string) {
    return firstValueFrom(
      this.http.post<{ respuesta: string }>(`${this.baseUrl}/${courseId}`, {
        message
      })
    );
  }

  getMessageHistory(courseId: number) {
    return firstValueFrom(
      this.http.get<{ role: string, content: string }[]>(`${this.baseUrl}/${courseId}/history`)
    );
  }

  getThreadsByCourse(courseId: number) {
    return firstValueFrom(this.http.get<any[]>(`${this.baseUrl}/${courseId}/threads`));
  }
  
}
