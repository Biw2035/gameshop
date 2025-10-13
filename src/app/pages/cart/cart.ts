import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { RouterLink } from '@angular/router';
import { CartService } from '../../CartService';
import { AuthService } from '../../auth.service';
import { Game } from '../home/home';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, Header, RouterLink, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class Cart implements OnInit {
  cartItems: Game[] = [];
  discountCode: string = '';
  discountValue: number = 0;
  totalPrice: number = 0;
  finalPrice: number = 0;
  
  constructor(
    private cartService: CartService, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getCart();
    this.calculateTotal(); // คำนวณยอดรวมตอนโหลด
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, g) => sum + Number(g.price), 0);
    this.finalPrice = this.totalPrice - this.discountValue ;
  }

  applyDiscount() {
  if (!this.discountCode) {
    alert('กรุณากรอกโค้ดก่อน');
    return;
  }

  this.cartService.getDiscountCode(this.discountCode).subscribe({
    next: (res: any) => {
      if (res && res.type === 'discount') {
        this.discountValue = res.value;
        alert(`ใช้โค้ด "${this.discountCode}" ลดราคา ${this.discountValue}`);
      } else {
        this.discountValue = 0;
        alert('โค้ดไม่ถูกต้อง');
      }
      this.calculateTotal();
    },
    error: (err) => {
      this.discountValue = 0;
      alert('โค้ดไม่ถูกต้อง');
      this.calculateTotal();
    }
  });
}

  removeGame(gameId: number) {
    this.cartService.removeFromCart(gameId);
    this.loadCart(); // รีเฟรชยอดรวมหลังลบ
  }

  getTotalFormatted(): string {
    return this.totalPrice.toLocaleString('th-TH', { style: 'currency', currency: 'THB' });
  }

  getFinalFormatted(): string {
    return this.finalPrice.toLocaleString('th-TH', { style: 'currency', currency: 'THB' });
  }

  checkout() {
    const confirmPurchase = window.confirm(
      `คุณแน่ใจหรือไม่ที่จะซื้อเกมทั้งหมด?\nยอดรวม: ${this.getTotalFormatted()}\nหลังหักส่วนลด: ${this.getFinalFormatted()}`
    );
    if (!confirmPurchase) return;

    this.cartService.checkout(this.discountCode).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.authService.updateCurrentUser(res.updatedUser);
        this.cartService.clearCart();
        this.router.navigate(['/mygame']);
      },
      error: (err) => alert(err.error?.error || 'เกิดข้อผิดพลาดระหว่างชำระเงิน')
    });
  }
}
