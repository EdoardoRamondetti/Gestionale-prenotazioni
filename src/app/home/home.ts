import { Component } from '@angular/core';
import { Aside } from "../aside/aside";
import { Header } from "../header/header";
import { CardAgenda } from "../card-agenda/card-agenda";
import { DataStorage } from '../shared/data-storage';
import { Router } from '@angular/router';
import { Shared } from '../shared/shared';
import { SharedArray } from '../shared/shared-array';

@Component({
  selector: 'app-home',
  imports: [Aside, Header, CardAgenda],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(public DataStorage: DataStorage,private router: Router, public shared:Shared, public sharedArray:SharedArray) {}
  ricaviMensili:number = 0
  ricaviMesePrima:number = 0
  prenotazioniOggi:number = 0
  prenotazioniIeri:number = 0
  percentualePrenotazioniIeriOggi:number = 0
  prenotazioniDaConfermare:number = 0
  percentualeRicaviMensili:number = 0
  clientiMeseCorrente:number = 0
  clientiMesePrecedente:number = 0
  nuoviClientiMensili:number = 0
  prenotazioniMassimeMensili:number = 0
  percentualePrenotazioniMensili:number = 0
  percentualePrenotazioniMensiliMesePrecedente:number = 0
  aumentoPercentialePrenotazioniMensili:number = 0
  prenotazioniGiornoCorrente:any = []
  prenotazioniDaConfermareVect:any = []

  ngOnInit(){
    this.DataStorage.inviaRichiesta("get","/nuoviClientiMensili")!.subscribe({
      next: (data) => {
        console.log(data)
        const dataOggi = new Date().toISOString().split('T')[0];
        const d = new Date();
        d.setDate(d.getDate() - 1);

        const dataIeri = d.toISOString().split('T')[0];
        let meseCorrente = new Date().getMonth() + 1
        let mesePrecedente = meseCorrente-1
        if(mesePrecedente == 0) mesePrecedente = 12
        if(meseCorrente == 13) meseCorrente = 1

        for (const servizio of data) {
          console.log(servizio)
          let numeroDelMese = parseInt(servizio.date.substring(5,7))
          if(numeroDelMese == meseCorrente){
            this.ricaviMensili += servizio.service.price
            this.clientiMeseCorrente++
          }
          if(numeroDelMese == mesePrecedente){
            this.ricaviMesePrima += servizio.service.price
            this.clientiMesePrecedente++
          }
          if(servizio.date == dataOggi){
            this.prenotazioniOggi++
            this.prenotazioniGiornoCorrente.push(servizio)
          }
          if(servizio.date == dataIeri)
            this.prenotazioniIeri++
        }
        this.percentualePrenotazioniIeriOggi = ((this.prenotazioniOggi-this.prenotazioniIeri)/this.prenotazioniIeri)*100
        if(this.prenotazioniOggi == 0 && this.prenotazioniIeri == 0) this.percentualePrenotazioniIeriOggi = 0
        else if(this.prenotazioniIeri) this.percentualePrenotazioniIeriOggi = 100
        this.percentualeRicaviMensili = ((this.ricaviMensili-this.ricaviMesePrima)/this.ricaviMesePrima)*100
        if(this.percentualeRicaviMensili == Infinity) this.percentualeRicaviMensili = 100
        this.nuoviClientiMensili = this.clientiMeseCorrente- this.clientiMesePrecedente

        console.log(this.prenotazioniGiornoCorrente)
      },
      error: (error) => {
      console.error(error)
    }
    })

    this.DataStorage.inviaRichiesta("get","/getPrenotazioniDaConfermare")!.subscribe({
            next: (data) => {
              console.log(data)
              this.prenotazioniDaConfermare = data.length
              this.prenotazioniDaConfermareVect = data
      },
      error: (error) => {
      console.error(error)
    }
    })

    this.DataStorage.inviaRichiesta("get","/getSettings")!.subscribe({
            next: (data) => {
              console.log(data)
              this.prenotazioniMassimeMensili = data.maxPrenotationsForMonth
              this.percentualePrenotazioniMensili = (this.clientiMeseCorrente/this.prenotazioniMassimeMensili)*100
              this.percentualePrenotazioniMensiliMesePrecedente = (this.clientiMesePrecedente/this.prenotazioniMassimeMensili)*100
              this.aumentoPercentialePrenotazioniMensili = this.percentualePrenotazioniMensili-this.percentualePrenotazioniMensiliMesePrecedente

      },
      error: (error) => {
      console.error(error)
    }
    })
  }

  cambiaPagina() {
    this.router.navigate(['/confermaPrenotazioniPage']);
    this.shared.setValore(this.prenotazioniDaConfermare.toString())
    this.sharedArray.sendArray(this.prenotazioniDaConfermareVect)
}
}
