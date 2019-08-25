import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from "../constants";
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({providedIn:"root"})
export class AuthService {
    private isAuthenticated=false
    private token:string;
    private tokenTimer:any;
    private userId:string;
    homeurl=Constants.HOME_URL;

    constructor(private http:HttpClient, private Router:Router, private _snackBar: MatSnackBar){}

    private authStatusListener=new Subject<boolean>()
    getToken(){
        return this.token;
    }
    getIsAuth(){
        return this.isAuthenticated;
    }
    getUserId(){
        return this.userId;
    }
    getauthStatusListener(){
        return this.authStatusListener.asObservable()
    }
    createAdmin(email:string, password:string){
        const authData:AuthData={email:email,password:password}
        this.http.post(this.homeurl+'admin/signup',authData)
        .subscribe(response=>{
            console.log(response)
            if(response){
                console.log(".....",response)
                this.login(email,password);

            }

        },(err)=>{
            this.authStatusListener.next(false);
            console.log('snk bar err',err)
            this.openSnackBar("signup error", "close")

        })
        
    }

    login(email:string, password:string){
        const authData:AuthData={email:email,password:password}
        this.http.post<{token:string,expiresIn:number,userid:string}>(this.homeurl+'admin/login',authData)
        .subscribe((response)=>{
            console.log(response)
            const token=response.token; 
            this.token=token;
            if(token){
                const expirationDuration=response.expiresIn
                this.setAuthTimer(expirationDuration)
                this.isAuthenticated=true;
                console.log("00000",response)
                this.userId=response.userid;
                console.log('***',this.userId)
                this.authStatusListener.next(true);
                const now = new Date()
                const expiresationDate=new Date(now.getTime()+expirationDuration*1000);
                this.saveAuthData(token,expiresationDate,this.userId);
                this.Router.navigate(['/']);
            }
            
        },(err)=>{
            console.log('snk bar err',err)
            this.authStatusListener.next(false);
            this.openSnackBar("email or password is incorrect", "close")
        })

    }

    autoAuthAdmin(){
        const authInfo=this.getAuthDataFromLocalStorage();
        if(!authInfo){
            return;
        }
        const now=new Date()
        const isInFuture=authInfo.expiration.getTime()-now.getTime()
        if(isInFuture>0){
            this.token=authInfo.token;
            this.isAuthenticated=true;
            this.userId=authInfo.userId;
            this.setAuthTimer(isInFuture/1000)
            this.authStatusListener.next(true)
        }
    }

    private getAuthDataFromLocalStorage(){
        const token=localStorage.getItem("token");
        const expiration=localStorage.getItem("expiration");
        const userId=localStorage.getItem("userId");
        if(!token || !expiration){
            return;
        }
        return {
            token:token,
            expiration:new Date(expiration),
            userId:userId
        }

    }

    private setAuthTimer(duration:number){
        this.tokenTimer=setTimeout(()=>{
            this.logout()
        },duration*1000)
    }
    logout(){
        clearTimeout(this.tokenTimer);
        this.token=null;
        this.isAuthenticated=false;
        this.authStatusListener.next(false);
        this.userId=null;
        this.clearAuthData()
        this.Router.navigate(['/']);
        this.openSnackBar("logged out successfully","close")

    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
          duration: 2000,
        });
      }


      private saveAuthData(token:string,expirationDate:Date,userId:string){
        localStorage.setItem("token",token);
        localStorage.setItem("expiration",expirationDate.toISOString())
        localStorage.setItem("userId",userId);
      }

      private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");

      }
}