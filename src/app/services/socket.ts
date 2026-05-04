import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://domu-app.onrender.com');
  }

  onTaskCreated(callback: any) {
    this.socket.on('task:created', callback);
  }

  onExpenseCreated(callback: any) {
    this.socket.on('expense:created', callback);
  }
}