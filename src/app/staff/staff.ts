import { Component } from '@angular/core';
import { Aside } from "../aside/aside";
import { Header } from "../header/header";

@Component({
  selector: 'app-staff',
  imports: [Aside, Header],
  templateUrl: './staff.html',
  styleUrl: './staff.css',
})
export class Staff {

}
