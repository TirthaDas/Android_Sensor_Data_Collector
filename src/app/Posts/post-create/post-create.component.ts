import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { Component, OnInit,EventEmitter,Output, OnDestroy} from '@angular/core';
// import {post} from '../post.model';
import {NgForm,FormControl,Validators} from "@angular/forms";
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
import { post } from '../post.model';


export interface SelectionType {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit,OnDestroy {

  //class properties
  newPost='NO CONTENT'
  private mode='create';
  private postId:string;
  private authStatusSub:Subscription
  post:post;
  seletedDuration:string;
  selectedSensor:string[];
  isloading=false
  durationsList: SelectionType[] = [
    {value: 'immediately', viewValue: 'immediately'},
    {value: 'twice a day', viewValue: 'twice a day'},
    {value: 'once a day', viewValue: 'once a day'},
    {value: 'once a week', viewValue: 'once a week'},

  ];
  duration = new FormControl('', [Validators.required]);
  FourthQuestion="no";

  sensorList: string[] = ['accelerometer', 'gyroscope', 'magnetic_field', 'ambient_temperature', 'light', 'gravity','proximity','game_rotation_vector'];
  
  // constructor
  constructor( public postService:PostsService, public route:ActivatedRoute, private AuthService:AuthService) {  }
  

  // on Init
  ngOnInit() {
    this.authStatusSub=this.AuthService.getauthStatusListener().subscribe(()=>{
      this.isloading=false
    })
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("postId")){
        this.mode='edit';
        this.postId=paramMap.get("postId");
        console.log('edit mode',this.postId,this.mode,paramMap.get("postId"))
        console.log('before',this.post)
        this.isloading=true
        this.postService.getPost(this.postId).subscribe((postData)=>{
          this.isloading=false
          console.log('*******77',postData)
            this.post={id:postData.posts._id,title:postData.posts.title,content:postData.posts.content,
              duration:postData.posts.duration,sensorType:postData.posts.sensorList,
          FirstQuestion:postData.questions[0]!=undefined?postData.questions[0].question:null,
          SecondQuestion:postData.questions[1]!=undefined?postData.questions[1].question:null,
          ThirdQuestion:postData.questions[2]!=undefined?postData.questions[2].question:null,
          FourthQuestion:postData.questions[3]!=undefined?postData.questions[3].question:null,

          FifthQuestion:postData.questions[4]!=undefined?postData.questions[4].question:null,
          creator:postData.creator}
        console.log('after',this.post)
        })

      }
      else{
        console.log('create mode')

        this.mode="create";
        this.postId=null;
      } 
    })

    // init multi select component
    

  }

  //add post method
  onSavePost(form: NgForm){
    console.log('recieved form', form.controls)
    if (form.invalid){
      return
    }
    this.isloading=true
    if(this.mode==="create"){
      console.log("-----------")
      
      if((!form.controls.sensorType.value)&&(!form.controls.FirstQuestion.value&&!form.controls.SecondQuestion.value&&!form.controls.ThirdQuestion.value&&!form.controls.FourthQuestion.value&&!form.controls.FifthQuestion.value)){
        console.log('**********')
        alert("please either select a sensor from the dropdown or add some questions in the questionnaire")
        return;
      }
      this.postService.addPosts(form.value.title,form.value.content,form.controls.duration.value,form.controls.sensorType.value,form.controls.FirstQuestion.value,form.controls.SecondQuestion.value,form.controls.ThirdQuestion.value,form.controls.FourthQuestion.value,form.controls.FifthQuestion.value);
      form.resetForm()
    }
    else{
      console.log("///////////////")
      console.log("..............",form.value.title,form.value.content,this.post.duration)
      this.postService.updatePost(this.postId,form.value.title,form.value.content);
    }
    
    
  }
  
ngOnDestroy(){
  this.authStatusSub.unsubscribe();
}
}



