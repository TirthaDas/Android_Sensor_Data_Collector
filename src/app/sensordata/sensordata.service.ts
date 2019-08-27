import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SensorDataService {
    private sensordata: any = [];
    private sensorDataUpdated = new Subject<{sensorData:any,sensorDataCount:number,message:string}>()

    constructor(private http: HttpClient,public router: Router,private _snackBar: MatSnackBar){}

    fetchSensorData(postsPerPage, currentPage,id: string){

    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    this.http.get<{ message: string, sensorData: any, sensorDataCount: number }>('http://localhost:3000/api/sensordata/'+ id + queryParams)
      .pipe(map((sensorData) => {
          console.log('seee',sensorData)
        //   if(sensorData.message==='no sensor data was asked in this project'){
        //       console.log('what')
        //     return {sensorData:{message:sensorData.message},sensorDataCount:0}
        //   }
        //   console.log('what 1 ')
          
        return {
          sensorData: sensorData.sensorData.map(data => {
            return {
              id: data._id,
              sensorData: data.sensorData,
              userId: data.userId,
              projectId:data.projectId,
              filename:data.filename

            };
          }),
          sensorDataCount: sensorData.sensorDataCount,
          message:sensorData.message
          
        }
      }))
      .subscribe(transformedsensorData => {
        //   if(transformedsensorData.sensorData.message==="no sensor data was asked in this project"){
        //     this.sensorDataUpdated.error({
        //         err:'no posts in this project'
        //     })
        //     this.router.navigate(["/"])
        //     .then(() => {
        //     this.openSnackBar("no sensor data was asked in this project","close")
        //     })
        //   }
        //   else if(transformedsensorData.sensorData.message==="no sensor data available yet"){
        //     this.sensorDataUpdated.error({
        //         err:'no sensor data available yet'
        //     })
        //     // this.router.navigate(["/"])
        //     // .then(() => {
        //     this.openSnackBar("no sensor data was asked in this project","close")
        //     // })
        //   }
          


        //   else{
          console.log('tra',transformedsensorData)
        this.sensordata = transformedsensorData.sensorData;
        
        this.sensorDataUpdated.next({
            sensorData:[...this.sensordata],
            sensorDataCount:transformedsensorData.sensorDataCount,
            message:transformedsensorData.message
            

        });
    // }
      }
    //   ,err=>{
    //       console.log('e222',err.error.message)
    //     //   this.sensorDataUpdated.error({
    //     //       err:err
    //     //   })
    //     if(err.error.message==="no sensor data available yet"){
    //         this.sensorDataUpdated.error({
    //                   err:err
    //               })
    //     }
    //     else{
    //       this.router.navigate(["/"])
    //     }
    //     //   .then(() => {
    //       this.openSnackBar(err.error.message,"close")
    //     //   })

          
    //   },()=>{
    //       console.log("complete")
    //   }
      )

    }

    getPostUpdateListener() {
        return this.sensorDataUpdated.asObservable()
      }


      openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
          duration: 2000,
        });
      }
    //   getPost(id: string) {
    //     return this.http.get<{
    //       posts: { _id: string, title: string, content: string, sensorList: string[], duration: string },
    //       questions: [{ question: string }, { question: string }, { question: string }, { question: string }, { question: string }],creator:string
    //     }>('http://localhost:3000/api/posts/' + id);
    //   }


    downloadFile(filename:string,projectId:string){
        console.log('here in service dwnld', filename,projectId)
        var body={filename:filename}
        return this.http.post('http://localhost:3000/api/downloadData/'+ projectId,body ,{
            responseType:'blob',
            headers:new HttpHeaders().append('Content-Type','application/json')
        })
    }
}
