import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface UserRegister {
    name: string;
    email: string;
    password: string;
    role: 'Administrador' | 'Profesor' | 'Alumno';
}

interface UserLogin {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'http://localhost:3000/api/user';

    constructor(private http: HttpClient) { }

    register(user: UserRegister) {
        return firstValueFrom(
            this.http.post(`${this.baseUrl}/register`, user)
        );
    }

    login(credentials: UserLogin) {
        return firstValueFrom(
            this.http.post<{ token: string; fatal?: string }>(`${this.baseUrl}/login`, credentials)
        );
    }


    saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    logout(): void {
        localStorage.removeItem('token');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }
} 
