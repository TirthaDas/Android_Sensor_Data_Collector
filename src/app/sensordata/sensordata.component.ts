import { SensorDataService } from './sensordata.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PageEvent } from '@angular/material';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import {saveAs} from 'file-saver';


@Component({
  selector: 'app-sensordata',
  templateUrl: './sensordata.component.html',
  styleUrls: ['./sensordata.component.css']
})
export class SensordataComponent implements OnInit,OnDestroy {
  sensorData:any=[]
  totalData:number=0
  postsPerPage=10
  currentPage=1
  // answer:any=[]
  Message:string=''
  isloading=false
  pageSizeOptions=[5,10,15,20]
  projectId:string
  private sensordatasub:Subscription
  constructor(private SensorDataService:SensorDataService,public route:ActivatedRoute,public router: Router) { }

  ngOnInit() {
    this.isloading=true
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("postId")){
        this.projectId=paramMap.get("postId");
      }})
    console.log("project id,aaa",this.projectId)

    this.SensorDataService.fetchSensorData(this.postsPerPage,this.currentPage,this.projectId)
    this.sensordatasub=this.SensorDataService.getPostUpdateListener().subscribe((sensordata:{sensorData:any,sensorDataCount:number,message:string})=>{
      this.isloading=false
      
      this.sensorData=sensordata.sensorData;
      this.totalData=sensordata.sensorDataCount;
      this.Message=sensordata.message
      // this.answer=sensordata.answers
      console.log("^^^^^^^^^^^^^^^YYYY",sensordata)

      // console.log("^^^^^^^^^^^^^^^zzzz",this.answer)
      if(this.Message==="no sensor data was asked in this project"){
        this.router.navigate(["/"])
            .then(() => {
            this.SensorDataService.openSnackBar("no sensor data was asked in this project","close")
            })
      }
      if(this.Message==="no sensor data available yet"){
      
            this.SensorDataService.openSnackBar("no sensor data available yet","close")
      }


    }
    ,err=>{
      this.isloading=false
      console.log('=========+++++++++',err)
      // this.router.navigate(["/"])
      // this.route.navi

    }
    )
  }
ngOnDestroy(){
  console.log('unsub')
  this.sensordatasub.unsubscribe()
}
onChangedPage(pageData:PageEvent){
  this.isloading=true
  this.currentPage=pageData.pageIndex+1
  this.postsPerPage=pageData.pageSize
  this.SensorDataService.fetchSensorData(this.postsPerPage,this.currentPage,this.projectId)
  
}
download(filename:string){
  console.log('in download',filename)
 var filename=filename.substring(filename.lastIndexOf('/')+1)
 this.SensorDataService.downloadFile(filename,this.projectId).subscribe(
   data=>{
    saveAs(data,filename)
    this.SensorDataService.openSnackBar("file downloaded successfully","close")

   },
   error=>{
     console.log('file download error',error)
     this.SensorDataService.openSnackBar("error downloading file","close")
   }
 )
}
}
