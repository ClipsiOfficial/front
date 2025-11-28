import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private _minimalHeader = new BehaviorSubject<boolean>(false);
  minimalHeader$ = this._minimalHeader.asObservable();

  get minimalHeaderValue() {
    return this._minimalHeader.value;
  }

  showFullHeader() {
    this._minimalHeader.next(false);
  }

  showMinimalHeader() {
    this._minimalHeader.next(true);
  }
}
