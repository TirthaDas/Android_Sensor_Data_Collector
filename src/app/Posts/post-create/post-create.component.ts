import { Component, OnInit,EventEmitter,Output} from '@angular/core';
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
export class PostCreateComponent implements OnInit {

  //class properties
  newPost='NO CONTENT'
  private mode='create';
  private postId:string;
  post:post;
  seletedDuration:string;
  selectedSensor:string[];

  durationsList: SelectionType[] = [
    {value: 'immediately', viewValue: 'immediately'},
    {value: 'twice a day', viewValue: 'twice a day'},
    {value: 'once a day', viewValue: 'once a day'},
    {value: 'once a week', viewValue: 'once a week'},

  ];
  duration = new FormControl('', [Validators.required]);
  FourthQuestion="no";

  sensorList: string[] = ['Accelerometer', 'Gyroscope', 'Magnetic_field', 'Ambient_temperature', 'ListenToLight', 'Gravity','Proximity','Game_rotation_vector'];
  
  // constructor
  constructor( public postService:PostsService, public route:ActivatedRoute) {  }
  

  // on Init
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("postId")){
        this.mode='edit';
        this.postId=paramMap.get("postId");
        console.log('edit mode',this.postId,this.mode,paramMap.get("postId"))
        console.log('before',this.post)

        this.postService.getPost(this.postId).subscribe((postData)=>{
          console.log('*******77',postData)
            this.post={id:postData.posts._id,title:postData.posts.title,content:postData.posts.content,
              duration:postData.posts.duration,sensorType:postData.posts.sensorList,
          FirstQuestion:postData.questions[0]!=undefined?postData.questions[0].question:null,
          SecondQuestion:postData.questions[1]!=undefined?postData.questions[1].question:null,
          ThirdQuestion:postData.questions[2]!=undefined?postData.questions[2].question:null,
          FourthQuestion:postData.questions[3]!=undefined?postData.questions[3].question:null,

          FifthQuestion:postData.questions[4]!=undefined?postData.questions[4].question:null}
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
  

}



