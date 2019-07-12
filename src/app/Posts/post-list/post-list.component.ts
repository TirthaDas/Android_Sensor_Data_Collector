import { Component, OnInit,Input } from '@angular/core';
import {post} from '../post.model';
import {PostsService} from '../posts.service'
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
// posts=[
//   {title:'First Post', content:'This is the first post\'s content '},
//   {title:'Second Post', content:'a harry potter fan'},
//   {title:'Third Post', content:'tent is the basics of life '}
// ]
@Input() posts : post[] = [];
// postService:PostsService;
  constructor( public postService : PostsService) {
    // this.postService=postService
  }

  ngOnInit() {
  }

}
