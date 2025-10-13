import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./pages/header/header";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected title = 'gameshop';
searchTerm: string = '';
  // เอาไว้รับ search event จาก Header
  onSearch(term: string) {
    // คุณสามารถ redirect หรือจัดการ term ได้ เช่น
    console.log('Search term from Header:', term);
    this.searchTerm = term;
  }
}
