import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
<<<<<<< Updated upstream

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
=======
import { LayoutService } from './services/layout.service';
import { NgIf, AsyncPipe, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    NgIf,
    AsyncPipe,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault
  ],
>>>>>>> Stashed changes
  templateUrl: './app.html',
})
export class App { }
