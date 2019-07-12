import { Component, OnInit,EventEmitter,Output} from '@angular/core';
import {post} from '../post.model';
import {NgForm} from "@angular/forms";
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  newPost='NO CONTENT'
EnteredContent='';
EnteredTitle='';
@Output() postCreated= new EventEmitter<post>();
  constructor() { }
  onAddPost(form: NgForm){
    if (form.invalid){
      return
    }
    const post:post={
      title:form.value.title,
      content:form.value.content
    };
    this.postCreated.emit(post);
    form.reset()
  }
  ngOnInit() {
  }

}
