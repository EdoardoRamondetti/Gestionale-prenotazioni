import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Aside } from "../aside/aside";

@Component({
  selector: 'app-servizi',
  imports: [Header, Aside],
  templateUrl: './servizi.html',
  styleUrl: './servizi.css',
})
export class Servizi {
  enabled=[true,true,true]
}
