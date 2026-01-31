import { Component, ElementRef, ViewChild } from '@angular/core';
import { Header } from "../header/header";
import { Aside } from "../aside/aside";
import { DataStorage } from '../shared/data-storage';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-prenotazioni',
  imports: [Header, Aside, FormsModule],
  templateUrl: './prenotazioni.html',
  styleUrl: './prenotazioni.css',
})
export class Prenotazioni {
  constructor(public DataStorage: DataStorage){}
  prenotazioniOggi:number = 0
  prenotazioniSettimana:number = 0
  prenotazioniMese:number = 0
  prenotazioniDaConfermare:number = 0
  showModalBool = false
  showModalAnnulla = false
  showModalConferma = false
  currentItem:any
  giorniSettimana:any = {
    "lunedì":1,"martedì":2,"mercoledì":3,"giovedì":4,"venerdì":5,"sabato":6,"domenica":7
  }
  mesi: any = {1: "Gennaio",2: "Febbraio",3: "Marzo",4: "Aprile",5: "Maggio",6: "Giugno",7: "Luglio",
  8: "Agosto",9: "Settembre",10: "Ottobre",11: "Novembre",12: "Dicembre"}
  prenotazioni:any = []
  resultOperationsConfirm:any = []
  showNewPrenotationSection:boolean = false
  clienteNuovaPrenotazione:string = ""
  servizioNuovaPrenotazione:string = ""
  dataNuovaPrenotazione:any
  oraNuovaPrenotazione:any
  operatoreNuovaPrenotazione:string = ""
  noteNuovaPrenotazione:string =  ""
  utenti:any
  servizi:any
  staff:any
  showErrorClient:boolean = false
  showErrorService:boolean = false
  showErrorData:boolean = false
  showErrorHour:boolean = false
  showErrorStaff:boolean = false
  durationService:number = 0
  priceService:number = 0
  showModificaPrenotazioneSection:boolean = false
  clienteModificaPrenotazione:string = ""
  servizioModificaPrenotazione:string = ""
  dataModificaPrenotazione:any
  oraModificaPrenotazione:any
  operatoreModificaPrenotazione:string = ""
  noteModificaPrenotazione:string = ""
  prenotazioneDaModificare:any
  varClienteModificaPrenotazione:string = ""
  _idPrenotazioneDaModificare:any
  showErrorClientModificaPrenotazione:boolean = false
  showErrorServiceModificaPrenotazione:boolean = false
  showErrorDataModificaPrenotazione:boolean = false
  showErrorHourModificaPrenotazione:boolean = false
  showErrorStaffModificaPrenotazione:boolean = false
  showCancellaPrenotazioneSection:boolean = false
  showErrorClientElliminaPrenotazione:boolean = false
  idPrenotazioneDaElliminare:any

  ngOnInit(){
    this.loadPage()
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

  getCorrectData(data:string){
    const vetcData = data.split("-")
    let nuovaData = ""
    nuovaData+=parseInt(vetcData[2]) + " " + this.mesi[parseInt(vetcData[1])] +" "+ vetcData[0]
    return nuovaData
  }

  showConfermaPrenotazione(item:any){
    this.showModalBool = true
    this.currentItem = item
  }

  confermaPrenotazione() {
    const tipoModifica = "conferma"
    const id = this.currentItem._id
  this.DataStorage.inviaRichiesta("patch","/modificaPrenotazione",{tipoModifica,id})!.subscribe({
            next: (data) => {
              this.loadPage()
      },
      error: (error) => {
      console.error(error)
    }
    })
    this.resultOperationsConfirm[this.currentItem["indice"]] = "Confermata"
    this.showModalBool = false
  }
  annullaFunction() {
  this.showModalBool = false
  }
  showModalNuovaPrenotazione(){
    this.showErrorClient = false
    this.showErrorService = false
    this.showErrorData = false
    this.showErrorHour = false
    this.showErrorStaff = false

    this.showNewPrenotationSection = true
    this.DataStorage.inviaRichiesta("get","/getServiceClientsOperators")!.subscribe({
            next: (data) => {
              this.utenti = data["users"]
              this.servizi = data["servizi"]
              this.staff = data["staff"]
      },
      error: (error) => {
      console.error(error)
    }
    })
  }

  getService(e:any){
    this.DataStorage.inviaRichiesta("get","/getInfoService",{"nameService":e.target.value})!.subscribe({
            next: (data) => {
              console.log(data)
              this.priceService = data[0].price
              this.durationService = data[0].duration
      },
      error: (error) => {
      console.error(error)
    }
    })
  }

  creaPrenotazione(){
    this.showErrorClient = false
    this.showErrorService = false
    this.showErrorData = false
    this.showErrorHour = false
    this.showErrorStaff = false
    if(this.clienteNuovaPrenotazione == ""){
      this.showErrorClient = true
    }
    if(this.servizioNuovaPrenotazione == ""){
      this.showErrorService = true
    }
    if(this.dataNuovaPrenotazione == null || this.dataNuovaPrenotazione < new Date().toISOString().split("T")[0]){
      this.showErrorData = true
    }
    if(this.oraNuovaPrenotazione == null){
      this.showErrorHour = true
    }
    if(this.operatoreNuovaPrenotazione == ""){
      this.showErrorStaff = true
    }
    if(this.clienteNuovaPrenotazione != "" && this.servizioNuovaPrenotazione != "" && 
      this.dataNuovaPrenotazione != null && this.oraNuovaPrenotazione != null && this.operatoreNuovaPrenotazione != ""
    )
    {
      this.DataStorage.inviaRichiesta("post","/addPrenotazione",{"cliente": this.clienteNuovaPrenotazione,
        "servizio":this.servizioNuovaPrenotazione, "data":this.dataNuovaPrenotazione, "ora": this.oraNuovaPrenotazione,
        "operatore":this.operatoreNuovaPrenotazione, "price":this.priceService, "duration":this.durationService,"note":this.noteNuovaPrenotazione
      })?.subscribe({})
      this.showNewPrenotationSection = false
      this.loadPage()
    }
  }

  loadPage(){
  this.prenotazioniOggi = 0
  this.prenotazioniSettimana = 0
  this.prenotazioniMese = 0
  this.prenotazioniDaConfermare = 0
  this.DataStorage.inviaRichiesta("get","/getPrenotazioniMensili")!.subscribe({
            next: (data) => {
              console.log(data)
              let meseCorrente = new Date().getMonth() + 1
              const dataCompleta = this.getData(new Date().toISOString()).split(" ")
              let giorno = dataCompleta[0]
              const primoGiorno = parseInt(dataCompleta[1]) - (this.giorniSettimana[giorno]-1)
              const ultimoGiorno = primoGiorno+6
              if(meseCorrente == 13) meseCorrente = 1
              const dataOggi = new Date().toISOString().split('T')[0];
              const prenotazioni = data
              for (const prenotazione of prenotazioni) {
                let numeroDelMese = parseInt(prenotazione.date.substring(5,7))
                if(prenotazione.date == dataOggi) this.prenotazioniOggi++
                if(numeroDelMese == meseCorrente ) this.prenotazioniMese++
                if(prenotazione.status == "pending") this.prenotazioniDaConfermare++
                if(prenotazione.date.split("-")[2] >= primoGiorno && prenotazione.date.split("-")[2] <= ultimoGiorno)
                  this.prenotazioniSettimana++
              }
      },
      error: (error) => {
      console.error(error)
    }
    })

    this.DataStorage.inviaRichiesta("get","/getAllPrenotazioni")!.subscribe({
      next: (data) => {
              this.prenotazioni = data
              let cont = 0
              for (const prenotazione of data) {
                if(prenotazione.status == "pending"){
                  this.resultOperationsConfirm.push("Da confermare")
                  prenotazione["indice"] = cont
                  cont++
                }
                else if(prenotazione.status == "confirmed"){
                  this.resultOperationsConfirm.push("Confermata")
                  prenotazione["indice"] = cont
                  cont++
                }
              }
      },
      error: (error) => {
      console.error(error)
    }
    })
}

showModificaPrenotazione(prenotazione:any){
  this.showErrorClientModificaPrenotazione = false
  this.showErrorServiceModificaPrenotazione = false
  this.showErrorDataModificaPrenotazione = false
  this.showErrorHourModificaPrenotazione = false
  this.showErrorStaffModificaPrenotazione = false
  
  this._idPrenotazioneDaModificare = prenotazione._id

  this.DataStorage.inviaRichiesta("get","/getServiceClientsOperators")!.subscribe({
            next: (data) => {
              console.log(data)
              this.utenti = data["users"]
              this.servizi = data["servizi"]
              this.staff = data["staff"] 

              this.clienteModificaPrenotazione = prenotazione.client.name
              this.servizioModificaPrenotazione = prenotazione.service.name
              this.dataModificaPrenotazione = prenotazione.date
              this.oraModificaPrenotazione = prenotazione.startTime
              this.operatoreModificaPrenotazione = prenotazione.staff.name
              this.noteModificaPrenotazione = prenotazione.notes
              this.priceService = prenotazione.service.price
              this.durationService = prenotazione.service.duration

              this.showModificaPrenotazioneSection = true
      },
      error: (error) => {
      console.error(error)
    }
    })
}

modificaPrenotazione(){
  this.showErrorClientModificaPrenotazione = false
  this.showErrorServiceModificaPrenotazione = false
  this.showErrorDataModificaPrenotazione = false
  this.showErrorHourModificaPrenotazione = false
  this.showErrorStaffModificaPrenotazione = false

  if(this.clienteModificaPrenotazione == ""){
      this.showErrorClientModificaPrenotazione = true
    }
    if(this.servizioModificaPrenotazione == ""){
      this.showErrorServiceModificaPrenotazione = true
    }
    if(this.dataModificaPrenotazione == null || this.dataNuovaPrenotazione < new Date().toISOString().split("T")[0]){
      this.showErrorDataModificaPrenotazione = true
    }
    if(this.oraModificaPrenotazione == null){
      this.showErrorHourModificaPrenotazione = true
    }
    if(this.operatoreModificaPrenotazione == ""){
      this.showErrorStaffModificaPrenotazione = true
    }
    if(this.clienteModificaPrenotazione != "" && this.servizioModificaPrenotazione != "" && 
      this.dataModificaPrenotazione != null && this.oraModificaPrenotazione != null && this.operatoreModificaPrenotazione != ""
    )
  this.DataStorage.inviaRichiesta("patch","/modificaDatiPrenotazione",{"_id":this._idPrenotazioneDaModificare,"cliente": this.clienteModificaPrenotazione,
        "servizio":this.servizioModificaPrenotazione, "data":this.dataModificaPrenotazione, "ora": this.oraModificaPrenotazione,
        "operatore":this.operatoreModificaPrenotazione, "price":this.priceService, "duration":this.durationService, "note":
      this.noteModificaPrenotazione})!.subscribe({
            next: (data) => {
              this.showModificaPrenotazioneSection = false
              this.loadPage()
      },
      error: (error) => {
      console.error(error)
    }
    })
  }

  showCancellaPrenotazione(prenotazione:any){
    this.showCancellaPrenotazioneSection = true
    this.currentItem = prenotazione
    this.showErrorClientElliminaPrenotazione = true
    this.idPrenotazioneDaElliminare = prenotazione._id
  }

  elliminaPrenotazione(){
    this.DataStorage.inviaRichiesta("delete","/elliminaPrenotazione/"+this.idPrenotazioneDaElliminare)!.subscribe({
            next: (data) => {
              console.log(data)
              this.showCancellaPrenotazioneSection = false
              this.loadPage()
      },
      error: (error) => {
      console.error(error)
    }
    })
  }
}