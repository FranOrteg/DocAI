import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  getToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    const decoded: any = jwtDecode(token as string);
    return decoded;
  }
}
