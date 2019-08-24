import { Router } from '@angular/router';
import { post } from './post.model';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
@Injectable({providedIn:'root'})
export class PostsService {

  private posts: post[] = [] ;
  private postUpdated =new Subject<post[]>()

constructor(private http:HttpClient , private router:Router){}
  getPosts(){
    this.http.get<{message:string,posts:any}>('http://localhost:3000/api/posts')
    .pipe(map((postData)=>{
      return postData.posts.map(post=>{
        return {
          id:post._id,
          title:post.title,
          content:post.content
        };
      })
    }))
    .subscribe(transformedPost=>{
        this.posts=transformedPost;
        this.postUpdated.next([...this.posts]);
      }
    )
  }

  getPostUpdateListener(){
  return  this.postUpdated.asObservable()
  }
  getPost(id:string){
    return this.http.get<{_id:string,posts:{_id:string,title:string,content:string,sensorList:string[],fileType:string},
    questions:[{question:string},{question:string},{question:string},{question:string},{question:string}]}>('http://localhost:3000/api/posts/'+ id);
  }
  addPosts(title:string,content:string,fileType:string,sensorType:string[],firstQuestion:string,secondQuestion:string,thirdQuestion:string,fourthQuestion:string,fifthQuesiton:string){
    const post: post ={id:null,title:title,content:content,fileType:fileType,sensorType:sensorType,FirstQuestion:firstQuestion,SecondQuestion:secondQuestion,ThirdQuestion:thirdQuestion,FourthQuestion:fourthQuestion,FifthQuestion:fifthQuesiton};
    this.http.post<{message: string, postId:string}>('http://localhost:3000/api/posts',post)
    .subscribe((responseData)=>{
      console.log("llllllll",responseData);
      const id = responseData.postId;
      post.id=id;
      console.log("oooooo",post,this.posts)
      this.posts.push(post)
      this.postUpdated.next([...this.posts])
      this.router.navigate(["/"])
    })

  }

  updatePost(id:string, title:string, content:string){
    const post:post={id:id,title:title,content:content,fileType:"",sensorType:["sensorType"],FirstQuestion:"firstQuestion",SecondQuestion:"secondQuestion",ThirdQuestion:"thirdQuestion",FourthQuestion:"fourthQuestion",FifthQuestion:"fifthQuesiton"}
    console.log("update called",post)

    this.http.put('http://localhost:3000/api/posts/'+ id,post)
    .subscribe(response=>{
        console.log("updated post",response )
        const updatedPost=[...this.posts]
        const oldPostIndex=updatedPost.findIndex(p=>p.id===post.id)
        updatedPost[oldPostIndex]=post
        this.posts=updatedPost
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"])

    })
  }

  deletePost(postId: string){
    console.log('delete called', postId)
    this.http.delete('http://localhost:3000/api/posts/'+ postId)
    .subscribe(responseData=>{
      const updatedPost =this.posts.filter(post =>
        post.id!==postId
      )
      this.posts=updatedPost;
      this.postUpdated.next([...this.posts])
    })
  }
}
