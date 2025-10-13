import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Header } from '../header/header';
@Component({
  selector: 'app-admin-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, Header],
  templateUrl: './admin-create.html',
  styleUrls: ['./admin-create.scss']
})
export class AdminCreate {

  currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // ข้อมูลเกม
  game = {
    title: '',
    description: '',
    price: 0,
    category: ''
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  // เลือกรูป + Preview
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // บันทึกเกม
  saveGame() {
    if (!this.game.title || !this.game.description || !this.game.price || !this.game.category || !this.selectedFile) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.game.title);
    formData.append('description', this.game.description);
    formData.append('price', this.game.price.toString());
    formData.append('category', this.game.category);
    if (this.selectedFile) formData.append('image', this.selectedFile);

    // ส่งไป Backend API
    const token = localStorage.getItem('token'); // JWT จาก login
    if (!token) {
      alert('คุณยังไม่ได้ login');
      return;
    }

    this.http.post('https://gameshop-api-1.onrender.com/api/games', formData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        alert('บันทึกเกมเรียบร้อย');
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error(err);
        alert('เกิดข้อผิดพลาดในการบันทึกเกม');
      }
    });
  }

  close() {
    this.router.navigate(['/home']);
  }
}
