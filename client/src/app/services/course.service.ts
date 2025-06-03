import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient) {}

  getCourses() {
    return firstValueFrom(
      this.http.get<any[]>(this.baseUrl, {
        withCredentials: true
      })
    );
  }
}
