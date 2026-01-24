import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from "../header/header";
import { Aside } from "../aside/aside";
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-impostazioni',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Aside, RouterOutlet],
  templateUrl: './impostazioni.html'
})
export class Impostazioni {
  constructor(private router: Router) {}

  pagina:number = 0
  cambiaPagina(numeroPagina: string,indice:number) {
    this.pagina = indice
    this.router.navigate(["/impostazioni/" + numeroPagina])
  }
}