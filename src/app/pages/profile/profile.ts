import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../header/header';
import { AuthService, User } from '../../auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
interface Transaction {
  id: number;
  type: 'topup' | 'purchase';
  amount: number;
  game_id?: number;
  game_name?: string | null;
  created_at: string;
}


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, Header],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile {
  user: User | null = null;
  topUpAmount: number = 0;
  transactions: Transaction[] = [];
  

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    // อัปเดต user ทุกครั้งจาก BehaviorSubject
    this.authService.currentUser$.subscribe(user => this.user = user);

    // โหลด transaction history
    this.loadTransactions();
  }

  goToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  topUp(amount?: number) {
    const addAmount = amount || this.topUpAmount;
    if (!addAmount || addAmount <= 0) return alert('กรุณาใส่จำนวนเงินถูกต้อง');

    this.authService.topUpWallet(addAmount).subscribe({
      next: () => {
        this.topUpAmount = 0;
        alert(`เติมเงิน ${addAmount} บาทเรียบร้อย`);
        // รีโหลด transactions ทันที
        this.loadTransactions();
      },
      error: err => alert('เติมเงินไม่สำเร็จ: ' + (err.error?.error || err.message))
    });
  }

  loadTransactions() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return;
  }

  this.http.get<{ transactions: Transaction[] }>(
    '${environment.apiUrl}/api/profile/transactions',
    { headers: { Authorization: `Bearer ${token}` } }
  ).subscribe({
    next: res => this.transactions = res.transactions,
    error: err => console.error('Failed to load transactions', err)
  });
}
}
