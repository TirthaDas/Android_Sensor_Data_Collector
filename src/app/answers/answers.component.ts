import { AnswerService } from './answer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit,OnDestroy {
  answerdata:any=[]
  totalData:number=0
  postsPerPage=5
  currentPage=1
  // answer:any=[]
  Message:string=''
  isloading=false
  pageSizeOptions=[2,5,10,20]
  projectId:string
  private answersub:Subscription
  constructor(private AnswerService:AnswerService,public route:ActivatedRoute,public router: Router) { }

  

  ngOnInit() {
    this.isloading=true
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("postId")){
        this.projectId=paramMap.get("postId");
      }})
    console.log("project id,aaa",this.projectId)

    this.AnswerService.fetchAnswerData(this.postsPerPage,this.currentPage,this.projectId)
    this.answersub=this.AnswerService.getPostUpdateListener().subscribe((answerdata:{Answers:any,AnswersCount:number,message:string})=>{
      this.isloading=false
      
      this.answerdata=answerdata.Answers;
      this.totalData=answerdata.AnswersCount;
      this.Message=answerdata.message
      // this.answer=sensordata.answers
      console.log("^^^^^^^^^^^^^^^ANSWERSYYYY",answerdata)

      // console.log("^^^^^^^^^^^^^^^zzzz",this.answer)
      if(this.Message==="no question was asked in this project"){
        this.router.navigate(["/"])
            .then(() => {
            this.AnswerService.openSnackBar("no question was asked in this project","close")
            })
      }
      if(this.Message==="no answer data available yet"){
      
            this.AnswerService.openSnackBar("no answers available yet","close")
      }
      if(this.Message==="not authorized"){
        console.log('here')
        this.router.navigate(["/"])
        .then(() => {
        this.AnswerService.openSnackBar("not authorized to view this data ","close")
        })

      }
    }
    ,err=>{
      this.isloading=false
      console.log('=========+++++++++',err)
     

    }
    )
  }
  ngOnDestroy(){
    console.log('unsub')
    this.answersub.unsubscribe()
  }
  onChangedPage(pageData:PageEvent){
    this.isloading=true
    this.currentPage=pageData.pageIndex+1
    this.postsPerPage=pageData.pageSize
    this.AnswerService.fetchAnswerData(this.postsPerPage,this.currentPage,this.projectId)
    
  }
}
