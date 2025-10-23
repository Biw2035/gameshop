import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Header } from '../header/header';
import { AuthService, User } from '../../auth.service';

export interface Game {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  created_at: string;
}

@Component({
  selector: 'app-mygames',
  standalone: true,
  imports: [CommonModule, HttpClientModule, Header],
  templateUrl: './mygame.html',
  styleUrls: ['./mygame.scss']
})
export class MyGames implements OnInit {
  games: Game[] = [];
  user: User | null = null;
  selectedGame: Game | null = null;
  loading: boolean = true;
  discountCodes: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => this.user = user);
  }

  ngOnInit() {
    this.loadMyGames();
    this.loadAvailableCodes(); // ✅ โหลดโค้ดส่วนลดทันทีเมื่อเปิดหน้า
  }

  loadMyGames() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.loading = false;
      return;
    }

    this.http.get<{ games?: Game[] }>('https://gameshop-api-1.onrender.com/api/mygames', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: res => {
        this.games = res.games || [];
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load my games', err);
        this.games = [];
        this.loading = false;
      }
    });
  }

loadAvailableCodes() {
  const token = localStorage.getItem('token'); // ดึง token
  if (!token) return; // ถ้าไม่มี token ก็ไม่โหลด

  this.http.get<any[]>('https://gameshop-api-1.onrender.com/api/available-codes', {
    headers: { Authorization: `Bearer ${token}` } // ✅ ใส่ token
  }).subscribe({
    next: (res) => (this.discountCodes = res),
    error: (err) => {
      console.error('โหลดโค้ดไม่สำเร็จ:', err);
    }
  });
}


  copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      alert(`คัดลอกโค้ด "${code}" แล้ว!`);
    }).catch(err => {
      console.error('คัดลอกไม่สำเร็จ:', err);
      alert('ไม่สามารถคัดลอกโค้ดได้');
    });
  }

  viewDetail(game: Game) {
    this.selectedGame = game;
  }

  closeDetail() {
    this.selectedGame = null;
  }
}
