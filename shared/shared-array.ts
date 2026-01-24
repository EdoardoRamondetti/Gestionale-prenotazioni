import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedArray {
  private arraySource = new BehaviorSubject<any[]>([]);
  array$ = this.arraySource.asObservable();

  sendArray(data: any[]) {
    this.arraySource.next(data);
  }
}
