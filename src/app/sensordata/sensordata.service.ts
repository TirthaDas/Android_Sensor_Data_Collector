import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SensorDataService {
    private sensordata: any = [];
    private sensorDataUpdated = new Subject<{sensorData:any,sensorDataCount:number}>()

    constructor(private http: HttpClient,public router: Router,private _snackBar: MatSnackBar){}

    fetchSensorData(postsPerPage, currentPage,id: string){

    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    this.http.get<{ message: string, sensorData: any, sensorDataCount: number }>('http://localhost:3000/api/sensordata/'+ id + queryParams)
      .pipe(map((sensorData) => {
          console.log('seee',sensorData)
          if(sensorData.message==='no sensor data was asked in this project'){
            return {sensorData:{message:sensorData.message},sensorDataCount:0}
          }
        return {
          sensorData: sensorData.sensorData.map(data => {
            return {
              id: data._id,
              sensorData: data.sensorData,
              userId: data.userId,
              projectId:data.projectId

            };
          }),
          sensorDataCount: sensorData.sensorDataCount,
          
        }
      }))
      .subscribe(transformedsensorData => {
          if(transformedsensorData.sensorData.message==="no sensor data was asked in this project"){
            this.sensorDataUpdated.error({
                err:'no posts in this project'
            })
            this.router.navigate(["/"])
            .then(() => {
            this.openSnackBar("no sensor data was asked in this project","close")
            })
          }
          else{
          console.log('tra',transformedsensorData)
        this.sensordata = transformedsensorData.sensorData;
        this.sensorDataUpdated.next({
            sensorData:[...this.sensordata],
            sensorDataCount:transformedsensorData.sensorDataCount
            

        });
    }
      },err=>{
          this.sensorDataUpdated.error({
              err:err
          })
        //   this.router.navigate(["/"])
        //   .then(() => {
          this.openSnackBar(err.error.message,"close")
        //   })

          
      }
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
}
