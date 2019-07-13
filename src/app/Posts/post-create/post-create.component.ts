import { Component, OnInit,EventEmitter,Output} from '@angular/core';
// import {post} from '../post.model';
import {NgForm} from "@angular/forms";
import { PostsService } from '../posts.service';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  newPost='NO CONTENT'
// EnteredContent='';
// EnteredTitle='';
// @Output() postCreated= new EventEmitter<post>();
  constructor( public postService:PostsService) {  }
  onAddPost(form: NgForm){
    if (form.invalid){
      return
    }

    // const post:post={
    //   title:form.value.title,
    //   content:form.value.content
    // };
    // this.postCreated.emit(post);
    this.postService.addPosts(form.value.title,form.value.content);
    form.resetForm()
    
  }
  ngOnInit() {

  }

}
