import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient) { }

  getCourses() {
    return firstValueFrom(
      this.http.get<any[]>(this.baseUrl, {
        withCredentials: true
      })
    );
  }

  createCourse(data: { name: string, description: string }) {
    return firstValueFrom
      (this.http.post<any>(this.baseUrl, data, {
        withCredentials: true
      }));
  }

  getCoursesByUser() {
    return firstValueFrom(
      this.http.get<any[]>(`${this.baseUrl}`, {
        withCredentials: true
      })
    );
  }

  deleteCourse(courseId: number) {
    return firstValueFrom(
      this.http.delete(`${this.baseUrl}/${courseId}`, {
        withCredentials: true
      })
    );
  }

  updateCourse(courseId: number, courseData: any): Promise<any> {
    return firstValueFrom(this.http.put(`${this.baseUrl}/${courseId}`, courseData));
  }
}
