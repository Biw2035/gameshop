import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: number;
  username: string;
  email: string;
  profile_image: string | null;
  wallet_balance: number;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private _currentUser$ = new BehaviorSubject<User | null>(null);

  isLoggedIn$ = this._isLoggedIn$.asObservable();
  currentUser$ = this._currentUser$.asObservable();

  BASE_URL = 'https://gameshop-api-1.onrender.com';

  constructor(private http: HttpClient) {

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user: User = JSON.parse(userData);
        this._currentUser$.next(user);
        this._isLoggedIn$.next(true);
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
        this.logout(); 
      }
    }
  }

  login(user: User, token: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);

    this._currentUser$.next(user);
    this._isLoggedIn$.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this._currentUser$.next(null);
    this._isLoggedIn$.next(false);
  }

 // ฟังก์ชันเติมเงิน
  topUpWallet(amount: number) {
    const token = localStorage.getItem('token');
    return this.http.put<{ user: User }>(
      '${environment.apiUrl}/profile/topup',
      { topUp: amount },
      { headers: { Authorization: `Bearer ${token}` } }
    ).pipe(
      tap(res => {
        this._currentUser$.next(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  updateCurrentUser(user: User) {
    this._currentUser$.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
}

  

