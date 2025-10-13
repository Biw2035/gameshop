import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService, User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

    const expectedRole = route.data['role'] as 'admin' | 'user' | undefined;

    return this.authService.currentUser$.pipe(
      take(1),
      map((user: User | null) => {
    
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }

        if (expectedRole && user.role !== expectedRole) {
          this.router.navigate(['/']); 
        }

        return true; 
      })
    );
  }
}
