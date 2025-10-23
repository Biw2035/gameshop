import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Header } from '../header/header';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, Header],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  username = '';
  email = '';
  password = ''; 
  message = '';

  profileImageFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private http: HttpClient, private router: Router) {}


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profileImageFile = input.files[0];


      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.onerror = () => console.error('Error reading file');
      reader.readAsDataURL(this.profileImageFile);
    }
  }

  register() {
    if (!this.username || !this.email || !this.password) {
      this.message = 'Please fill all fields';
      return;
    }

    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('email', this.email);
    formData.append('password', this.password);
    if (this.profileImageFile) {
      formData.append('profile_image', this.profileImageFile);
    }

    this.http.post('${environment.apiUrl}/register', formData)
      .subscribe({
        next: (res: any) => {
          this.message = res.message;

          this.username = '';
          this.email = '';
          this.password = '';
          this.profileImageFile = null;
          this.previewUrl = null;

          this.router.navigate(['/login']);
        },
        error: (err) => this.message = err.error?.error || 'Registration failed'
      });
  }
}
