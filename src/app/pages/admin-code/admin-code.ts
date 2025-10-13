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

  newCode = { code: '', type: 'discount', value: 0 };
  codeList: any[] = [];

  constructor(private codeService: CodeService) {}  // <== Inject API Service

  ngOnInit(): void {
    this.loadCodes();
  }

 createCode() {
  this.codeService.createCode(this.newCode).subscribe(() => {
    this.loadCodes();
    // เคลียร์ฟอร์มโดยยังคง type = discount
    this.newCode = { code: '', type: 'discount', value: 0 };
    alert("สร้างโค้ดลดราคาสำเร็จ!");
  });
}

  loadCodes() {
  this.codeService.getCodes().subscribe(data => {
    this.codeList = data.codes; // <-- ต้องเอา .codes
  });
}
}
