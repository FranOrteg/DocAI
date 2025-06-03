import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseUrl = 'http://localhost:3000/api/documents';

  constructor(private http: HttpClient) {}

  uploadDocument(courseId: number, document: File) {
    const formData = new FormData();
    formData.append('document', document);

    return firstValueFrom(this.http.post(`${this.baseUrl}/${courseId}`, formData));
  }

  getDocumentsByCourse(courseId: number) {
    return firstValueFrom(this.http.get<any[]>(`${this.baseUrl}/courses/${courseId}`));
  }
}
