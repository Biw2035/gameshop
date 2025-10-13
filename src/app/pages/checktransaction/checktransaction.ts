import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Header } from '../header/header';
import { environment } from '../../../environments/environment';
interface Transaction {
  id: number;
  type: 'topup' | 'purchase';
  amount: number;
  game_name?: string;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  wallet_balance: number;
}

@Component({
  selector: 'app-checktransaction',
  standalone: true, // เพิ่ม standalone
  imports: [CommonModule, FormsModule, HttpClientModule, Header], // import Header ด้วย
  templateUrl: './checktransaction.html',
  styleUrls: ['./checktransaction.scss']
})
export class Checktransaction implements OnInit {
  users: User[] = [];
  selectedUserId: number | null = null;
  transactions: Transaction[] = [];
  apiUrl = '${environment.apiUrl}/api/admin';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const token = localStorage.getItem('token') || '';
    this.http.get<{ users: User[] }>(`${this.apiUrl}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: res => this.users = res.users,
      error: err => console.error('Failed to load users', err)
    });
  }

  onUserChange() {
    if (!this.selectedUserId) {
      this.transactions = [];
      return;
    }

    const token = localStorage.getItem('token') || '';
    this.http.get<{ transactions: Transaction[] }>(
      `${this.apiUrl}/user/${this.selectedUserId}/transactions`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: res => this.transactions = res.transactions,
      error: err => console.error('Failed to load transactions', err)
    });
  }
}
