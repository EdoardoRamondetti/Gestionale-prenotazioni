import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-agenda',
  imports: [],
  templateUrl: './card-agenda.html',
  styleUrl: './card-agenda.css',
})
export class CardAgenda {
  @Input() servizi:any = []
}
