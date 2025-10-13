import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Header } from '../header/header';

import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, Header],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  email = '';
  password = '';
  message = '';
  
  
  constructor(
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.message = 'Please fill all fields';
      return;
    }

    this.http.post('https://gameshop-api-1.onrender.com/api/login', {
      email: this.email,
      password: this.password
    }).subscribe({

      next: (res: any) => {

        this.authService.login(res.user, res.token);


        this.router.navigate(['/']);
      },

      error: (err) => {
        this.message = err.error.error || 'Login failed';
      }
    });
  }
}

