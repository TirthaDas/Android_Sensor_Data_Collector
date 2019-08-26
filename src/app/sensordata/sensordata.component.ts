import { SensorDataService } from './sensordata.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-sensordata',
  templateUrl: './sensordata.component.html',
  styleUrls: ['./sensordata.component.css']
})
export class SensordataComponent implements OnInit,OnDestroy {
  sensorData:any=[]
  totalData:number=0
  answer:any=[]
  projectId:string
  private sensordatasub:Subscription
  constructor(private SensorDataService:SensorDataService,public route:ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("postId")){
        this.projectId=paramMap.get("postId");
      }})
    this.SensorDataService.fetchSensorData(10,1,this.projectId)
    this.sensordatasub=this.SensorDataService.getPostUpdateListener().subscribe((sensordata:{sensorData:any,sensorDataCount:number,answers:any})=>{
      this.sensorData=sensordata.sensorData;
      this.totalData=sensordata.sensorDataCount;
      this.answer=sensordata.answers
      console.log("^^^^^^^^^^^^^^^Xxxxx",this.sensorData,)
      console.log("^^^^^^^^^^^^^^^Xxxxx",this.answer)


    },err=>{
      console.log('=========',err)
      
    })
  }
ngOnDestroy(){
  this.sensordatasub.unsubscribe()
}
}
