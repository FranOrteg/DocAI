import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) { }

  getAllUsers(): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${this.baseUrl}`)
    );
  }
  
  deleteUser(userId: number){
    return firstValueFrom(
      this.http.delete<void>(`${this.baseUrl}/${userId}`))
  }

  createUser(userData: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.baseUrl}/register`, userData));
  }
  
  updateUser(userId: number, userData: any): Promise<any> {
    return firstValueFrom(this.http.put(`${this.baseUrl}/${userId}`, userData));
  }
  
}
