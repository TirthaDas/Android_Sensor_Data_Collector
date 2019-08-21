import { Component, OnInit,EventEmitter,Output} from '@angular/core';
// import {post} from '../post.model';
import {NgForm} from "@angular/forms";
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
import { post } from '../post.model';
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
            this.post={id:postData._id,title:postData.title,content:postData.content}
        })
        console.log('after',this.post)

      }
      else{
        console.log('create mode')

        this.mode="create";
        this.postId=null;
      } 
    })
  }

  //add post method
  onSavePost(form: NgForm){
    if (form.invalid){
      return
    }
    if(this.mode==="create"){
      this.postService.addPosts(form.value.title,form.value.content);
      form.resetForm()
    }
    else{
      this.postService.updatePost(this.postId,form.value.title,form.value.content);
    }
    
    
  }
  

}
