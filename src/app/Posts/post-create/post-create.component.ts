import { Component, OnInit,EventEmitter,Output} from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  newPost='NO CONTENT'
EnteredContent='';
EnteredTitle='';
@Output() postCreated= new EventEmitter();
  constructor() { }
  onAddPost(){
    const post={
      title:this.EnteredTitle,
      content:this.EnteredContent
    };
    this.postCreated.emit(post);

    this.EnteredTitle='';
    this.EnteredContent='';
  }
  ngOnInit() {
  }

}
