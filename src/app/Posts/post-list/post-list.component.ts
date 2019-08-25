import { AuthService } from './../../auth/auth.service';
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
userIsAuthenticated=false
userId:string
private postSub :Subscription;
// postService:PostsService;
  private authStatusSubs:Subscription
  constructor( public postService : PostsService, private AuthService:AuthService) {
    // this.postService=postService
  }

  ngOnInit() {
    this.isloading=true
    this.postService.getPosts(this.postsPerPage,this.currentPage)
    this.userId=this.AuthService.getUserId();
    this.postSub=this.postService.getPostUpdateListener().subscribe((postData:{posts:post[],postCount:number})=>{
      this.isloading=false
      this.posts=postData.posts;
      this.totalPosts=postData.postCount
      console.log("^^^^^^^^^^^^^^^Xxxxx",this.userId,)
      console.log("^^^^^^^^^^^^^^^Xxxxx",this.posts)

    })
    this.userIsAuthenticated=this.AuthService.getIsAuth()
    this.authStatusSubs=this.AuthService.getauthStatusListener()
    .subscribe(isAuthenticated=>{
       this.userIsAuthenticated=isAuthenticated;
       this.userId=this.AuthService.getUserId();

    })
  }
  onChangedPage(pageData:PageEvent){
    this.isloading=true
    this.currentPage=pageData.pageIndex+1
    this.postsPerPage=pageData.pageSize
    this.postService.getPosts(this.postsPerPage,this.currentPage)
    console.log("^^^^^^^^^^^^^^^Xxxxx",this.userId,)
      console.log("^^^^^^^^^^^^^^^Xxxxx",this.posts)
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
    this.authStatusSubs.unsubscribe()
  }
  

}
