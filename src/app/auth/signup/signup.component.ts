import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {
  isloading=false
  constructor(public authService:AuthService) { }
  private authStatusSubs:Subscription
  ngOnInit() {
    this.authStatusSubs=this.authService.getauthStatusListener().subscribe(austhStatus=>{
      this.isloading=false
    }) 
  }
  onSignup(form:NgForm){
    console.log(form.value)
    if(form.invalid){
      return
    }
    this.isloading=true;
    this.authService.createAdmin(form.value.email,form.value.password);
  }

  ngOnDestroy(){
    this.authStatusSubs.unsubscribe()
  }

}
