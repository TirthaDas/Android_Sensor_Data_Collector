import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  // selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isloading=false
  constructor(private AuthService:AuthService) { }

  ngOnInit() {
  }
  onLogin(form:NgForm){
    if(form.invalid){
      return 
    }
    this.isloading=true;
    this.AuthService.login(form.value.email,form.value.password)

  }

}
