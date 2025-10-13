import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, User } from '../../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  user: User | null = null;
  searchTerm: string = '';

  @Output() searchEvent = new EventEmitter<string>();

  showTypeOptions = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.currentUser$ = this.authService.currentUser$;
  }
ngOnInit() {
  this.authService.currentUser$.subscribe(user => {
    this.user = user; // จะอัปเดตทุกครั้งที่ BehaviorSubject เปลี่ยน
  });
}
loadUser() {
  const userData = localStorage.getItem('user');
  this.user = userData ? JSON.parse(userData) : null;
}

  onSearchChange() {
    this.searchEvent.emit(this.searchTerm);
  }

  onLogout(): void {
    this.authService.logout();
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  toggleTypeOptions() {
    this.showTypeOptions = !this.showTypeOptions;
  }

  goToCreate(type: string) {
    this.router.navigate(['/admin/create'], { queryParams: { type } });
    this.showTypeOptions = false;
  }
}
