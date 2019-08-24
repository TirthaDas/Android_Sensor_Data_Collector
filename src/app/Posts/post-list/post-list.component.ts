import { Component, OnInit,Input,OnDestroy } from '@angular/core';
import  {Subscription} from 'rxjs'
import {post} from '../post.model';
import {PostsService} from '../posts.service'
import { PageEvent } from '@angular/material';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

posts : post[] = [];
totalPosts=0
postsPerPage=3
currentPage=1
pageSizeOptions=[1,2,3, 5,10]
isloading=false

private postSub :Subscription;
// postService:PostsService;
  constructor( public postService : PostsService) {
    // this.postService=postService
  }

  ngOnInit() {
    this.isloading=true
    this.postService.getPosts(this.postsPerPage,this.currentPage)
    this.postSub=this.postService.getPostUpdateListener().subscribe((postData:{posts:post[],postCount:number})=>{
      this.isloading=false
      this.posts=postData.posts;
      this.totalPosts=postData.postCount
    })
  }
  onChangedPage(pageData:PageEvent){
    this.isloading=true
    this.currentPage=pageData.pageIndex+1
    this.postsPerPage=pageData.pageSize
    this.postService.getPosts(this.postsPerPage,this.currentPage)
  }
  onDelete(postId:string){
    // if (this.posts.length === 1) { // checks if this is the last post on the site 
    //   this.currentPage -= 1;
    //   }
      if (this.posts.length === 1 && (this.totalPosts - (this.postsPerPage * this.currentPage)) < this.totalPosts){
        this.currentPage -= 1;
      }
    this.isloading=true
    this.postService.deletePost(postId).subscribe(()=>{
      this.isloading=false
      this.postService.openSnackBar("project deleted successfully", "close")
      this.postService.getPosts(this.postsPerPage,this.currentPage)
    })
  }
  ngOnDestroy(){
    this.postSub.unsubscribe()
  }
  

}
