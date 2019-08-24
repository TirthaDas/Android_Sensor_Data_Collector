import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isloading=false
  constructor(public authService:AuthService) { }

  ngOnInit() {
  }
  onSignup(form:NgForm){
    console.log(form.value)
    if(form.invalid){
      return
    }
    this.authService.createAdmin(form.value.email,form.value.password);
  }
}
