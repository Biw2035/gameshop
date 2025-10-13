import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, User } from '../../auth.service';
import { Header } from '../header/header';
@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, Header],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.scss']
})
export class EditProfile implements OnInit {

  user: User = {
    id: 0,
    username: '',
    email: '',
    profile_image: null,
    wallet_balance: 0,
    role: 'user'
  };

  profileFile: File | null = null;
  token = localStorage.getItem('token') || '';
  

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {

    this.authService.currentUser$.subscribe(user => {
      if (user) this.user = { ...user };
    });
  }


  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.profileFile = event.target.files[0];
    }
  }

  updateProfile() {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
    const formData = new FormData();

    formData.append('username', this.user.username);
    formData.append('email', this.user.email);

    if (this.profileFile) {
      formData.append('profile_image', this.profileFile);
    }

    this.http.put<any>('https://gameshop-api-1.onrender.com/api/profile', formData, { headers })
      .subscribe({
        next: res => {
          alert('อัปเดตข้อมูลสำเร็จ');
          this.authService.login(res.user, this.token);
          this.router.navigate(['/profile']);
        },
        error: err => {
          console.error('อัปเดตไม่สำเร็จ', err);
          alert('อัปเดตไม่สำเร็จ');
        }
      });
  }

}
