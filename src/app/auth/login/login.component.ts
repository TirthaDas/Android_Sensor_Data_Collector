import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  // selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  isloading=false
  constructor(private AuthService:AuthService) { }
  private authStatusSubs
  ngOnInit() {
    this.authStatusSubs=this.AuthService.getauthStatusListener().subscribe(austhStatus=>{
      this.isloading=false
    })
  }
  onLogin(form:NgForm){
    if(form.invalid){
      return 
    }
    this.isloading=true;
    this.AuthService.login(form.value.email,form.value.password)

  }
  ngOnDestroy(){
    this.authStatusSubs.unsubscribe()
  }

}
