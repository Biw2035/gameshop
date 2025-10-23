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
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, g) => sum + Number(g.price), 0);
    this.finalPrice = Math.max(this.totalPrice - this.discountValue, 0);
  }

  // ปุ่ม "ใช้โค้ด"
useDiscountCode() {
  if (!this.discountCode.trim()) {
    alert('กรุณากรอกโค้ดก่อน');
    return;
  }

  // รีเซ็ตส่วนลด
  this.discountValue = 0;
  this.calculateTotal();

  this.cartService.getDiscountCode(this.discountCode).subscribe({
    next: (res: any) => {
      if (res.usedByCurrentUser) {
        alert('คุณใช้โค้ดนี้แล้ว');
        this.discountCode = '';
        return; // หยุดคำนวณส่วนลด
      }

      // ถ้าใช้ได้
      if (res.value > 0) {
        this.discountValue = res.value;
        this.calculateTotal();
        alert(`ใช้โค้ด "${this.discountCode}" ลดราคา ${this.discountValue} บาท\nราคาสุทธิ: ${this.finalPrice.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}`);
      } else {
        alert('โค้ดไม่ถูกต้อง หรือใช้ไม่ได้');
        this.discountCode = '';
      }
    },
    error: (err: any) => {
      let msg = err.error?.error || err.error?.message || 'โค้ดไม่ถูกต้อง';
      alert(msg);
      this.discountCode = '';
    }
  });
}





  removeGame(gameId: number) {
    this.cartService.removeFromCart(gameId);
    this.loadCart();
  }

  getTotalFormatted(): string {
    return this.totalPrice.toLocaleString('th-TH', { style: 'currency', currency: 'THB' });
  }

  getFinalFormatted(): string {
    return this.finalPrice.toLocaleString('th-TH', { style: 'currency', currency: 'THB' });
  }

  // กด checkout
  checkout() {
    if (this.discountCode.trim()) {
      // ตรวจสอบโค้ดก่อน checkout
      this.cartService.getDiscountCode(this.discountCode).subscribe({
        next: (res: any) => {
          if (res?.usedByCurrentUser) {
            alert('คุณใช้โค้ดนี้แล้ว ส่วนลดจะไม่ถูกนำมาคำนวณ');
            this.discountValue = 0;
            this.discountCode = '';
            this.calculateTotal();
            this.finalizeCheckout();
            return;
          }

          if (res?.value > 0) {
            this.discountValue = res.value;
            this.calculateTotal();
            this.finalizeCheckout();
          } else {
            alert('โค้ดไม่ถูกต้อง หรือใช้ไม่ได้');
            this.discountValue = 0;
            this.discountCode = '';
            this.calculateTotal();
            this.finalizeCheckout();
          }
        },
        error: (err: any) => {
          let msg = err.error?.error || err.error?.message || 'โค้ดไม่ถูกต้อง';
          alert(msg);
          this.discountValue = 0;
          this.discountCode = '';
          this.calculateTotal();
          this.finalizeCheckout();
        }
      });
    } else {
      this.finalizeCheckout();
    }
  }

  private finalizeCheckout() {
    const confirmPurchase = window.confirm(
      `คุณแน่ใจหรือไม่ที่จะซื้อเกมทั้งหมด?\nยอดรวม: ${this.getTotalFormatted()}\nหลังหักส่วนลด: ${this.getFinalFormatted()}`
    );
    if (!confirmPurchase) return;

    this.cartService.checkout(this.cartItems, this.discountCode).subscribe({
      next: (res: any) => {
        alert(`${res.message}\nส่วนลดที่ใช้: ${res.discountApplied || 0} บาท`);
        this.discountValue = res.discountApplied || 0;
        this.discountCode = '';
        this.calculateTotal();
        this.authService.updateCurrentUser(res.updatedUser);
        this.cartService.clearCart();
        this.router.navigate(['/mygame']);
      },
      error: (err) => {
        let msg = err.error?.error || 'เกิดข้อผิดพลาดระหว่างชำระเงิน';
        alert(msg);
      }
    });
  }
}
