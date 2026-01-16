import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Aside } from "../aside/aside";

@Component({
  selector: 'app-prenotazioni',
  imports: [Header, Aside],
  templateUrl: './prenotazioni.html',
  styleUrl: './prenotazioni.css',
})
export class Prenotazioni {
  
}
