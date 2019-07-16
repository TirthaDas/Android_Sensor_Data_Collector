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

posts : post[] = [];
private postSub :Subscription;
// postService:PostsService;
  constructor( public postService : PostsService) {
    // this.postService=postService
  }

  ngOnInit() {
    this.postService.getPosts()
    this.postSub=this.postService.getPostUpdateListener().subscribe((posts:post[])=>{
      this.posts=posts;
    })
  }
  onDelete(postId:string){
    this.postService.deletePost(postId);
  }
  ngOnDestroy(){
    this.postSub.unsubscribe()
  }

}
