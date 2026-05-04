import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = 'https://domu-app-be.onrender.com';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.api}/auth/register`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getUsers() {
    const token = localStorage.getItem('token');

    return this.http.get(`${this.api}/auth/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getAllUsers() {
    const token = localStorage.getItem('token');

    return this.http.get(`${this.api}/auth/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getMe() {
    const token = localStorage.getItem('token');

    return this.http.get(`${this.api}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
  }
}