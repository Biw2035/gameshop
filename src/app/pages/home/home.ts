  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { Router, RouterLink } from '@angular/router';
  import { Observable } from 'rxjs';
  import { AuthService, User } from '../../auth.service';
  import { FormsModule } from '@angular/forms';
  import { Header } from '../header/header';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../../CartService';
export interface Game {
  id: number;
  title: string;        // ชื่อเกม ใช้ใน HTML
  description: string;
  price: number;
  category: string;
  image: string;
  created_at: string; 
}


  @Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, HttpClientModule, FormsModule, Header],
    templateUrl: './home.html',
    styleUrls: ['./home.scss']
  })
  export class Home {

    isLoggedIn$: Observable<boolean>;
    currentUser$: Observable<User | null>;

    games: Game[] = [];
    topGames: Game[] = [];
    filteredGames: Game[] = [];
    categories: string[] = [];
    selectedCategory: string = '';
    searchTerm: string = '';

    myGames: Game[] = []; // เกมที่ user มีแล้ว


    constructor(private authService: AuthService, private http: HttpClient,private router: Router, private cartService: CartService ) {
      this.isLoggedIn$ = this.authService.isLoggedIn$;
      this.currentUser$ = this.authService.currentUser$;
    }

    ngOnInit() {
      this.loadGames();
      this.loadMyGames();
      this.loadTopGames();
    }

    loadGames() {
      this.http.get<Game[]>('${environment.apiUrl}/games')
        .subscribe({
          next: (res) => {
            this.games = res;
            this.filteredGames = res;
            this.categories = [...new Set(res.map(g => g.category))];
          },
          error: (err) => console.error('Error loading games', err)
        });
    }

    loadMyGames() {
      const token = localStorage.getItem('token') || '';
      if (!token) return;

      this.http.get<{ games: Game[] }>('${environment.apiUrl}/mygames', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: res => this.myGames = res.games,
        error: err => console.error(err)
      });
    }

       loadTopGames() {
          this.http.get<Game[]>('${environment.apiUrl}/top-games')
            .subscribe({
              next: res => this.topGames = res || [],
              error: err => console.error('Failed to load top games', err)
            });
        }

    //Category
    applyFilters() {
      let result = this.games;

      if (this.selectedCategory) {
        result = result.filter(g => g.category === this.selectedCategory);
      }

      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase().trim();
        result = result.filter(g =>
          g.title.toLowerCase().includes(term) ||
          g.description.toLowerCase().includes(term) ||
          g.category.toLowerCase().includes(term)
        );
      }

      this.filteredGames = result;
    }

   filterGames(category: string) {
  this.selectedCategory = category;
  let result: Game[] = [];

  if (category === 'top') {
    // กรองเฉพาะ topGames
    result = this.topGames;
  } else if (category) {
    // กรองตาม category
    result = this.games.filter(g => g.category === category);
  } else {
    result = this.games;
  }

  // ถ้ามี search term ให้กรองต่อ
  if (this.searchTerm) {
    const term = this.searchTerm.toLowerCase().trim();
    result = result.filter(g =>
      g.title.toLowerCase().includes(term) ||
      g.description.toLowerCase().includes(term) ||
      g.category.toLowerCase().includes(term)
    );
  }

  this.filteredGames = result;
}

    onSearchGames(term: string) {
      this.searchTerm = term;
      this.applyFilters();
    }

    addToCart(game: Game) {
    const added = this.cartService.addToCart(game, this.myGames);
    if (!added) {
      // แจ้งผู้ใช้ว่ามีแล้ว
      const owned = this.myGames.some(g => g.id === game.id);
      if (owned) alert(`คุณมีเกม "${game.title}" อยู่แล้ว`);
      else alert(`"${game.title}" อยู่ในตะกร้าแล้ว`);
      return;
    }

    alert(`"${game.title}" added to cart!`);
  }

selectedGame: Game | null = null;
        // เปิด modal
    viewDetail(game: Game) {
      this.selectedGame = game;
    }

    // ปิด modal
    closeDetail() {
      this.selectedGame = null;
    }

 goToEdit(gameId: number) {
    this.router.navigate(['/game-edit', gameId]); // ใช้งานได้เลย
  }

    deleteGame(game: Game) {
    if (!confirm(`Are you sure you want to delete "${game.title}"?`)) return;

    const token = localStorage.getItem('token'); // ดึง JWT จาก localStorage
    if (!token) {
      alert('You must login first!');
      return;
    }

    this.http.delete(`${environment.apiUrl}/games/${game.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.games = this.games.filter(g => g.id !== game.id);
        this.filteredGames = this.filteredGames.filter(g => g.id !== game.id);
        console.log('Game deleted successfully');
      },
      error: (err) => {
        console.error('Failed to delete game', err);
        alert('Failed to delete game: ' + err.message);
      }
    });
  }


    trackById(index: number, game: Game) {
      return game.id;
    }
  }
