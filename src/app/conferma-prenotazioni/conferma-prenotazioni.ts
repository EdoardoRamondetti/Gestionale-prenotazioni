import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Shared } from '../shared/shared';
import { SharedArray } from '../shared/shared-array';
import { DataStorage } from '../shared/data-storage';

@Component({
  selector: 'app-conferma-prenotazioni',
  imports: [],
  templateUrl: './conferma-prenotazioni.html',
  styleUrl: './conferma-prenotazioni.css',
})
export class ConfermaPrenotazioni {
  constructor(private router: Router, public shared:Shared, public sharedArray:SharedArray, public DataStorage:DataStorage) {}

  prenotazioniDaConfermare:number = 0
  prenotazioni:any = []
  date:any = []
  showModalBool:boolean = false
  showModalAnnulla:boolean = false
  showModalConferma:boolean = false
  resultOperations:any = []


  @ViewChild('divConferma') div!:any;
  
   cambiaPagina() {
    this.router.navigate(["/home"])
  }

  ngOnInit(){
      this.shared.valore$.subscribe(val => {
    console.log('Valore ricevuto:', val);
    this.prenotazioniDaConfermare = parseInt(val)
  });

  this.sharedArray.array$.subscribe(val => {
    console.log(val)
    this.prenotazioni = val

    for (const item of this.prenotazioni) {
      this.date.push(this.getData(item.date))
      this.resultOperations.push("⏳ Da confermare")
    }
  })
  }

  getData(item:any){
    const dataString = item
    const data = new Date(dataString);

      const formatter = new Intl.DateTimeFormat('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }); 
      return formatter.format(data)
  }

  quantoTempoFa(dataString:string) {
  const oggi:any = new Date();
  const data :any= new Date(dataString);

  // azzera ore per evitare bug
  oggi.setHours(0,0,0,0);
  data.setHours(0,0,0,0);

  const diffMs = oggi - data;
  const diffGiorni = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffGiorni === 0) return 'oggi';
  if (diffGiorni === 1) return 'ieri';
  if (diffGiorni < 7) return `${diffGiorni} giorni fa`;
  if (diffGiorni < 30) return `${Math.floor(diffGiorni / 7)} settimane fa`;
  return `${Math.floor(diffGiorni / 30)} mesi fa`;
  }

  showModal(modale:string){
    this.showModalBool = true
    if(modale == "annulla") this.showModalAnnulla = true
    else this.showModalConferma = true
    
  }

  annullaFunction(){
    this.showModalBool = false
    this.showModalAnnulla = false
    this.showModalConferma = false
  }

  modificaPrenotazione(tipoModifica:string,id:any,i:number){
    this.DataStorage.inviaRichiesta("patch","/modificaPrenotazione",{tipoModifica,id})!.subscribe({
            next: (data) => {
              console.log(data)
      },
      error: (error) => {
      console.error(error)
    }
    })

    this.showModalBool = false
    this.showModalAnnulla = false
    this.showModalConferma = false
    this.resultOperations[i] = tipoModifica == "rifiuta" ? "❌ Annullata" : "✅ Confermata"
    this.prenotazioniDaConfermare--
  }
}
