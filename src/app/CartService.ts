import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Game } from './pages/home/home';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'gameshop_cart';
  private apiUrl = '${environment.apiUrl}/api'; 

  constructor(private http: HttpClient, private authService: AuthService) {} 

  getCart(): Game[] {
    const data = localStorage.getItem(this.cartKey);
    return data ? JSON.parse(data) : [];
  }

  addToCart(game: Game, ownedGames: Game[] = []): boolean {
    const cart = this.getCart();
    const alreadyOwned = ownedGames.some(g => g.id === game.id);
    if (alreadyOwned) return false;
    const exists = cart.some(g => g.id === game.id);
    if (exists) return false;

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

 getDiscountCode(code: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/codes/${code}`, { headers });
  }


 checkout(discountCode: string = ''): Observable<any> {
  const cartItems = this.getCart();
  const token = localStorage.getItem('token') || '';

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post(`${this.apiUrl}/checkout`, { cartItems, discountCode }, { headers }).pipe(
    tap((res: any) => {
      // อัปเดต user หลังซื้อสำเร็จ
      if (res.updatedUser) {
        this.authService.updateCurrentUser(res.updatedUser);
      }
    })
  );
}

}
