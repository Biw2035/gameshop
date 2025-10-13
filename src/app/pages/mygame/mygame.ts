// mygames.ts
import { Component } from '@angular/core';
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
export class MyGames {
  games: Game[] = [];
  user: User | null = null;
  selectedGame: Game | null = null;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => this.user = user);
    this.loadMyGames();
  }

  loadMyGames() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get<{ games: Game[] }>('https://gameshop-api-1.onrender.com/api/mygames', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: res => this.games = res.games,
      error: err => console.error('Failed to load my games', err)
    });
  }

  viewDetail(game: Game) {
    this.selectedGame = game;
  }

  closeDetail() {
    this.selectedGame = null;
  }
}
