import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { TaskService } from '../../services/task';
import { ExpenseService } from '../../services/expense';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { SocketService } from '../../services/socket';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {

  isLoading = true;

  tasks: any[] = [];
  expenses: any[] = [];

  currentUser: any = null;
  users: any[] = [];
  allUsers: any[] = [];

  // TASK
  title = '';
  description = '';
  assignedTo = '';
  
  // EXPENSE
  expenseTitle = '';
  amount = 0;
  paidBy = '';
  splitBetween: string[] = [];

  editingTaskId: string | null = null;

editTitle = '';
editDescription = '';
editAssignedTo = '';

editingExpenseId: string | null = null;

editExpenseTitle = '';
editAmount = 0;
editPaidBy = '';
editSplitBetween: string[] = [];

debts: any[] = [];

updateDebts() {
  this.debts = this.getDebtsList();
}

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private expenseService: ExpenseService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.loadDashboard();
    this.socketService.onTaskCreated((data: any) => {
  console.log("New task received", data);

  this.tasks = [data.data.task, ...this.tasks];
  this.cdr.detectChanges();
});

this.socketService.onExpenseCreated((data: any) => {
  console.log("New expense received", data);

  this.expenses = [data.data.expense, ...this.expenses];
  this.updateDebts();
  this.cdr.detectChanges();
});
  }

  loadDashboard() {
    this.isLoading = true;

    forkJoin({
      tasks: this.taskService.getTasks(),
      expenses: this.expenseService.getExpenses(),
      user: this.authService.getMe(),
      users: this.authService.getUsers(),
      allUsers: this.authService.getAllUsers()
    }).subscribe({
      next: (res: any) => {
        this.tasks = res.tasks.data.tasks;
        this.expenses = res.expenses.data.expenses;
        this.currentUser = res.user.data.user;
        this.users = res.users.data.users;
        this.allUsers = res.allUsers.data.users;

        this.updateDebts();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur chargement:", err);
        this.isLoading = false;
      }
    });
  }

  createTask() {
    const token = localStorage.getItem('token');
    
    const task = {
      title: this.title,
      description: this.description,
      assignedTo: this.assignedTo
    };

    this.taskService.createTask(task).subscribe((res: any) => {
  this.title = '';
  this.description = '';
  this.assignedTo = '';

  // ajouter directement
  this.tasks = [res.data.task, ...this.tasks];
});
  }

  createExpense() {
    const expense = {
      title: this.expenseTitle,
      amount: this.amount,
      paidBy: this.paidBy,
      splitBetween: this.splitBetween
    };

    this.expenseService.createExpense(expense).subscribe((res: any) => {
  this.expenseTitle = '';
  this.amount = 0;
  this.paidBy = '';
  this.splitBetween = [];

  this.expenses = [res.data.expense, ...this.expenses];
  this.loadDashboard();
});
  }

  startEditTask(task: any) {
  this.editingTaskId = task._id;
  this.editTitle = task.title;
  this.editDescription = task.description;
  this.editAssignedTo = task.assignedTo?._id;
}

startEditExpense(expense: any) {
  this.editingExpenseId = expense._id;
  this.editExpenseTitle = expense.title;
  this.editAmount = expense.amount;
  this.editPaidBy = expense.paidBy?._id;
  this.editSplitBetween = expense.splitBetween.map(
  (u: any) => u.id || u._id
);
}

saveTask(taskId: string) {
  const updated = {
    title: this.editTitle,
    description: this.editDescription,
    assignedTo: this.editAssignedTo
  };

  this.taskService.updateTask(taskId, updated).subscribe(() => {
    this.editingTaskId = null;
    this.loadDashboard();
  });
}

saveExpense(id: string) {
  const updated = {
    title: this.editExpenseTitle,
    amount: this.editAmount,
    paidBy: this.editPaidBy,
    splitBetween: this.editSplitBetween
  };

  this.expenseService.updateExpense(id, updated).subscribe(() => {
    this.editingExpenseId = null;
    this.loadDashboard();
  });
}

deleteTask(taskId: string) {
  this.taskService.deleteTask(taskId).subscribe(() => {
    this.loadDashboard();
  });
}

deleteExpense(id: string) {
  this.expenseService.deleteExpense(id).subscribe(() => {
    this.loadDashboard();
  });
}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  calculateDebts() {
  const balances: any = {};

  // init balances
  this.allUsers.forEach(user => {
    balances[user.id] = 0;
  });

  this.expenses.forEach(expense => {
    const amount = expense.amount;
    const paidBy = expense.paidBy?._id;
    const participants = expense.splitBetween || [];

    if (!participants.length) return;

    const splitAmount = amount / participants.length;

    participants.forEach((user: any) => {
      if (user._id !== paidBy) {
        balances[user._id] -= splitAmount;
        balances[paidBy] += splitAmount;
      }
    });
  });

  return balances;
}

getDebtsList() {
  const balances = this.calculateDebts();
  const debts: any[] = [];

  const users = this.allUsers;

  users.forEach(u1 => {
    if (balances[u1.id] < 0) {
      users.forEach(u2 => {
        if (balances[u2.id] > 0) {

          const amount = Math.min(
            Math.abs(balances[u1.id]),
            balances[u2.id]
          );

          if (amount > 0.01) {
            debts.push({
              from: u1.name,
              to: u2.name,
              amount: amount.toFixed(2)
            });

            balances[u1.id] += amount;
            balances[u2.id] -= amount;
          }
        }
      });
    }
  });

  return debts;
}

getTotalForUser(userId: string) {
  const balances = this.calculateDebts();
  return balances[userId];
}

onSplitChange(event: any, userId: string) {
  if (event.target.checked) {
    this.splitBetween.push(userId);
  } else {
    this.splitBetween = this.splitBetween.filter(id => id !== userId);
  }
}

onEditSplitChange(event: any, userId: string) {
  if (event.target.checked) {
    if (!this.editSplitBetween.includes(userId)) {
      this.editSplitBetween.push(userId);
    }
  } else {
    this.editSplitBetween = this.editSplitBetween.filter(id => id !== userId);
  }
}

toggleTaskStatus(task: any) {
  const newStatus = task.status === "pending" ? "done" : "pending";

  this.taskService.updateStatus(task._id, newStatus)
    .subscribe((res: any) => {

      // update local instantané
      this.tasks = this.tasks.map(t =>
        t._id === task._id ? { ...t, status: newStatus } : t
      );

      this.cdr.detectChanges();
    });
}
}