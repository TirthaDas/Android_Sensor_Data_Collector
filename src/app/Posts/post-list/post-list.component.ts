import { Component, OnInit,Input,OnDestroy } from '@angular/core';
import  {Subscription} from 'rxjs'
import {post} from '../post.model';
import {PostsService} from '../posts.service'
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {
// posts=[
//   {title:'First Post', content:'This is the first post\'s content '},
//   {title:'Second Post', content:'a harry potter fan'},
//   {title:'Third Post', content:'tent is the basics of life '}
// ]
posts : post[] = [];
private postSub :Subscription;
// postService:PostsService;
  constructor( public postService : PostsService) {
    // this.postService=postService
  }

  ngOnInit() {
    this.posts = this.postService.getPosts()
    this.postSub=this.postService.getPostUpdateListener().subscribe((posts:post[])=>{
      this.posts=posts;
    })
  }
  ngOnDestroy(){
    this.postSub.unsubscribe()
  }

}
