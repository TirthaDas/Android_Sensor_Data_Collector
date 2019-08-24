import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from "../constants";

@Injectable({providedIn:"root"})
export class AuthService {
    homeurl=Constants.HOME_URL;
    constructor(private http:HttpClient){}


    createAdmin(email:string, password:string){
        const authData:AuthData={email:email,password:password}
        this.http.post(this.homeurl+'admin/signup',authData)
        .subscribe(response=>{
            console.log(response)
        })
    }

    login(email:string, password:string){
        const authData:AuthData={email:email,password:password}
        this.http.post(this.homeurl+'admin/login',authData)
        .subscribe((response)=>{
            console.log(response)
        })

    }
}