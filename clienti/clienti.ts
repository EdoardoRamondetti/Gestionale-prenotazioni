import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Aside } from "../aside/aside";

@Component({
  selector: 'app-clienti',
  imports: [Header, Aside],
  templateUrl: './clienti.html',
  styleUrl: './clienti.css',
})
export class Clienti {
  informazioni=true
  storico=false
  note=false
  open = false

  close() {
  this.open = false;
}

  toggle(info: string) {
    this.informazioni = info === 'informazioni';
    this.storico = info === 'storico';
    this.note = info === 'note';
  }
}
