import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aside',
  imports: [NgClass],
  templateUrl: './aside.html',
  styleUrl: './aside.css',
})
export class Aside {
  constructor(private router: Router) {}
  @Input() currentPage:string = ""
  vectBtn:any = [true,false,false,false,false,false]

  cambiaPagina(numero:number,pagina:string) {
    for (let i = 0; i < this.vectBtn.length; i++) {
      this.vectBtn[i] = false
    }
    this.vectBtn[numero] = true
    this.router.navigate(["/" + pagina])
  }
}
