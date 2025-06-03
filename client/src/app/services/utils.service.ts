import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  getToken(): any | null {
    if (typeof window === 'undefined') return null; 
  
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      return jwtDecode<any>(token);
    } catch {
      return null;
    }
  }
  
}
