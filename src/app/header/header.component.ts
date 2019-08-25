import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{
  private authListenerSubs:Subscription
  public userIsAuthenticated=false;
  constructor(private AuthService:AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated=this.AuthService.getIsAuth();
    this.authListenerSubs=this.AuthService.getauthStatusListener()
    .subscribe(isAuthenticated=>{
      this.userIsAuthenticated=isAuthenticated ;
    })
  }
  onLogout(){
    this.AuthService.logout()
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
  

}
