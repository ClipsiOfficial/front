import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type HeaderMode = 'full' | 'minimal' | 'login';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private _headerMode = new BehaviorSubject<HeaderMode>('full');
  headerMode$ = this._headerMode.asObservable();

  get headerModeValue() {
    return this._headerMode.value;
  }

  showFullHeader() {
    this._headerMode.next('full');
  }

  showMinimalHeader() {
    this._headerMode.next('minimal');
  }

  showLoginHeader() {
    this._headerMode.next('login');
  }
}
