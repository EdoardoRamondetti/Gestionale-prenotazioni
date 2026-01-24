import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { DataStorage } from '../shared/data-storage';
import {Shared} from "../shared/shared"

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgStyle],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router: Router, public DataStorage: DataStorage, public shared: Shared) {}

  showPassword:boolean = false
  textContentEmail:string = ""
  textContentPsw:string = ""
  thereIsEmail = true
  thereIsPsw = true
  validEmail = true
  failedLogin = false

  login() {
    this.failedLogin = false
    this.thereIsEmail = true
    this.thereIsPsw = true
    this.validEmail = true
    let successLogin = false;

    if(this.textContentEmail == "" && this.textContentPsw == ""){
      this.thereIsEmail = false
      this.thereIsPsw = false
      return
    }

    if(this.textContentEmail == "" && this.textContentPsw != ""){
      this.thereIsEmail = false
      return
    }

    if(this.textContentEmail != "" && this.textContentPsw == ""){
      this.thereIsPsw = false
      return
    }

    if(!this.textContentEmail.includes("@") || !this.textContentEmail[this.textContentEmail.indexOf("@")+1]
      || !this.textContentEmail[this.textContentEmail.indexOf("@")-1]){
      this.validEmail = false
      return
    }

  this.DataStorage.inviaRichiesta("post","/login",{"email":this.textContentEmail, "password":this.textContentPsw})!
  .subscribe({
    next: (data) => {
      console.log(data)
      if(data){
        this.shared.setValore(data.name + "-" + data.surname)
        if(data.role == "admin")
          this.router.navigate(['/home']);
      }
      else
        this.failedLogin = true
    },
    error: (error) => {
      console.error(error)
    }
  })  

  }

  showPsw() {
    this.showPassword = !this.showPassword
  }
}
