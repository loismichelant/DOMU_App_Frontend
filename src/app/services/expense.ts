import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ExpenseService {

  private api = 'https://domu-app.onrender.com';

  constructor(private http: HttpClient) {}

  getExpenses() {
    const token = localStorage.getItem('token');

    return this.http.get(`${this.api}/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  createExpense(expense: any) {
    const token = localStorage.getItem('token');

    return this.http.post(`${this.api}/expenses`, expense, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  updateExpense(id: string, data: any) {
    const token = localStorage.getItem('token');

    return this.http.put(`${this.api}/expenses/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteExpense(id: string) {
    const token = localStorage.getItem('token');

    return this.http.delete(`${this.api}/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}