import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Game } from './pages/home/home';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'gameshop_cart';
  private apiUrl = 'https://gameshop-api-1.onrender.com/api'; 

  constructor(private http: HttpClient, private authService: AuthService) {} 

  // ------------------- Cart LocalStorage -------------------
  getCart(): Game[] {
    const data = localStorage.getItem(this.cartKey);
    return data ? JSON.parse(data) : [];
  }

  addToCart(game: Game, ownedGames: Game[] = []): boolean {
    const cart = this.getCart();

    // ตรวจสอบว่าเกมมีใน ownedGames หรือ cart แล้ว
    if (ownedGames.some(g => g.id === game.id)) return false;
    if (cart.some(g => g.id === game.id)) return false;

    cart.push(game);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    return true;
  }

  removeFromCart(gameId: number) {
    const cart = this.getCart();
    const newCart = cart.filter(g => g.id !== gameId);
    localStorage.setItem(this.cartKey, JSON.stringify(newCart));
  }

  clearCart() {
    localStorage.removeItem(this.cartKey);
  }

  // ------------------- Discount Code -------------------
  getDiscountCode(code: string): Observable<{ type: string, value: number }> {
    const token = localStorage.getItem('token') || '';
    return this.http.get<{ type: string, value: number }>(
      `${this.apiUrl}/codes/${code}`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  // ------------------- Checkout -------------------
  checkout(cartItems: Game[], discountCode: string = ''): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/checkout`, { cartItems, discountCode }, { headers }).pipe(
      tap((res: any) => {
        // อัปเดต user หลัง checkout
        if (res.updatedUser) {
          this.authService.updateCurrentUser(res.updatedUser);
        }
      })
    );
  }
}
