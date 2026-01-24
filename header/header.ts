import { Component, Input } from '@angular/core';
import { Shared } from '../shared/shared';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() namePage = ""
  name:string = ""
  surname:string = ""
  constructor(private shared: Shared) {
  this.shared.valore$.subscribe(val => {
    console.log('Valore ricevuto:', val);
    this.name = val.split("-")[0]
    this.surname = val.split("-")[1]
  });
}
}
