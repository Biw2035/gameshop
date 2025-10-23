import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Game } from '../home/home';

@Component({
  selector: 'app-game-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './edit-game.html',
  styleUrls: ['./edit-game.scss']
})


export class GameEdit {
  gameId: number | null = null;
  game: Game | null = null;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.gameId = +params['id'];
      this.loadGame();
    });
  }

  loadGame() {
    if (!this.gameId) return;

    this.http.get<Game>(`https://gameshop-api-1.onrender.com/api/games/${this.gameId}`)
      .subscribe({
        next: (res) => this.game = res,
        error: (err) => {
          console.error('Failed to load game', err);
          alert('Cannot load game data.');
        }
      });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveEdit() {
    if (!this.gameId) return;

    const formData = new FormData();
    if (this.game) {
      formData.append('title', this.game.title);
      formData.append('description', this.game.description);
      formData.append('price', this.game.price.toString());
      formData.append('category', this.game.category);
    }
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must login first!');
      return;
    }

    this.http.put(`https://gameshop-api-1.onrender.com/api/games/${this.gameId}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        alert('Game updated successfully');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Failed to update game', err);
        alert('Failed to update game');
      }
    });
  }

  cancelEdit() {
    this.router.navigate(['/']);
  }
}