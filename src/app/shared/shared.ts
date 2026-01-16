import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Shared {
  private valoreSource = new BehaviorSubject<string>(''); // valore iniziale
  valore$ = this.valoreSource.asObservable();

  setValore(val: string) {
    this.valoreSource.next(val);
  }
}
