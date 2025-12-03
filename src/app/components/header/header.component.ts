import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../services/layout.service';
import { HeaderLoginComponent } from './header-login/header-login.component';
import { HeaderMinimalComponent } from './header-minimal/header-minimal.component';
import { HeaderFullComponent } from './header-full/header-full.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    HeaderLoginComponent,
    HeaderMinimalComponent,
    HeaderFullComponent
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnDestroy {
  private layout = inject(LayoutService);
  private sub = new Subscription();

  mode = signal<'full' | 'minimal' | 'login'>('full');

  constructor() {
    this.sub.add(
      this.layout.headerMode$.subscribe(v => {
        this.mode.set(v);
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

