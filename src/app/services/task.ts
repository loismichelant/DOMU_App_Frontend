import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private api = 'https://domu-app-be.onrender.com';

  constructor(private http: HttpClient) {}

  getTasks() {
    const token = localStorage.getItem('token');
  
    return this.http.get(`${this.api}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  createTask(task: any) {
    const token = localStorage.getItem('token');

    return this.http.post(`${this.api}/tasks`, task, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  updateTask(id: string, data: any) {
    const token = localStorage.getItem('token');

    return this.http.put(`${this.api}/tasks/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateStatus(taskId: string, status: string) {
  const token = localStorage.getItem('token');

  return this.http.patch(
    `${this.api}/tasks/${taskId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

  deleteTask(id: string) {
    const token = localStorage.getItem('token');

    return this.http.delete(`${this.api}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}