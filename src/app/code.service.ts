import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CodeService {

  private apiUrl = '${environment.apiUrl}/api/admin/codes'; // เปลี่ยน URL ให้ตรง backend

  constructor(private http: HttpClient) {}

  // โหลดโค้ดทั้งหมด
  getCodes(): Observable<{ codes: any[] }> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<{ codes: any[] }>(this.apiUrl, { headers });
}

  // สร้างโค้ดใหม่
  createCode(codeData: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, codeData, { headers });
  }

  // ลบโค้ด
  deleteCode(id: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
