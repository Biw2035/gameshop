import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { CodeService } from '../../code.service';

@Component({
  selector: 'app-admin-code',
  standalone: true,
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './admin-code.html',
  styleUrls: ['./admin-code.scss']
})
export class AdminCode implements OnInit {

  newCode = this.getDefaultCode();
  codeList: any[] = [];
  editing: boolean = false;  // ตรวจสอบว่ากำลังแก้ไข

  setMaxUses: boolean = false;
setExpiresAt: boolean = false;

  constructor(private codeService: CodeService) {}

  ngOnInit(): void {
    this.loadCodes();
  }

  // ฟังก์ชันสร้าง default code
  getDefaultCode() {
    const today = new Date().toISOString().split('T')[0]; // yyyy-MM-dd
    return {
      id: 0,
      code: '',
      type: 'discount',
      value: 0,
      max_uses: 1,
      expires_at: today
    };
  }

  resetForm() {
  this.newCode = { id:0, code:'', type:'discount', value:0, max_uses:1, expires_at:'' };
  this.setMaxUses = false;
  this.setExpiresAt = false;
}
  createCode() {
  // ตรวจสอบโค้ดว่างหรือมูลค่า <= 0
  if (!this.newCode.code.trim()) {
    alert('กรุณากรอกโค้ด!');
    return;
  }
  if (this.newCode.value <= 0) {
    alert('กรุณากรอกมูลค่าโค้ดมากกว่า 0');
    return;
  }

  if (this.editing) {
    this.updateCode();
    return;
  }

  this.codeService.createCode(this.newCode).subscribe(() => {
    this.loadCodes();
    this.resetForm();
    alert("สร้างโค้ดลดราคาสำเร็จ!");
  });
}

  loadCodes() {
    this.codeService.getCodes().subscribe(data => {
      this.codeList = data.codes;
    });
  }

  deleteCode(id: number) {
    if (!confirm('คุณแน่ใจว่าต้องการลบโค้ดนี้?')) return;

    this.codeService.deleteCode(id).subscribe({
      next: () => {
        this.codeList = this.codeList.filter(c => c.id !== id);
        alert('ลบโค้ดเรียบร้อยแล้ว');
      },
      error: (err) => {
        console.error(err);
        alert('ลบโค้ดไม่สำเร็จ: ' + err.message);
      }
    });
  }

  // =================== EDIT CODE ===================
  editCode(code: any) {
    this.editing = true;
    // ตรวจสอบ expires_at ให้ไม่เกินวันนี้
    const today = new Date().toISOString().split('T')[0];
    const expires = code.expires_at > today ? today : code.expires_at;
    this.newCode = { ...code, expires_at: expires };
  }

  updateCode() {
    this.codeService.updateCode(this.newCode.id, this.newCode).subscribe({
      next: () => {
        this.loadCodes();
        this.resetForm();
        alert('แก้ไขโค้ดสำเร็จ!');
      },
      error: (err: { message: string; }) => {
        console.error(err);
        alert('แก้ไขโค้ดไม่สำเร็จ: ' + err.message);
      }
    });
  }
}
