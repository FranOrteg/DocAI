import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  private baseUrl = 'http://localhost:3000/api/chat';

  constructor(private http: HttpClient) { }

  sendMessage(courseId: number, message: string, threadId: string | null = null, forceNewThread: boolean = false) {
    return firstValueFrom(
      this.http.post<{ respuesta: string; threadId: string }>(`${this.baseUrl}/${courseId}`, {
        message,
        threadId,
        forceNewThread
      })
    );
  }


  getMessageHistory(courseId: number) {
    return firstValueFrom(
      this.http.get<{ role: string, content: string }[]>(`${this.baseUrl}/${courseId}/history`)
    );
  }

  getThreadsByCourse(courseId: number) {
    return firstValueFrom(
      this.http.get<any[]>(`${this.baseUrl}/${courseId}/threads`)
    );
  }

  getThreadHistory(openaiThreadId: string) {
    return firstValueFrom(
      this.http.get<{ role: string, content: string }[]>(`${this.baseUrl}/thread/${openaiThreadId}/history`)
    );
  }

  deleteThread(threadId: number) {
    return firstValueFrom(
      this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/thread/${threadId}`)
    );
  }
  
}
