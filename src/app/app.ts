import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LayoutService } from './services/layout.service';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    NgIf,
    AsyncPipe  
  ],
  templateUrl: './app.html',
})
export class App {
  constructor(public layout: LayoutService) {}
}
