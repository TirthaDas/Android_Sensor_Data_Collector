import { post } from './post.model';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
@Injectable({providedIn:'root'})
export class PostsService {

  private posts: post[] = [] ;
  private postUpdated =new Subject<post[]>()

constructor(private http:HttpClient){}
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
    return this.http.get<{_id:string,title:string,content:string}>('http://localhost:3000/api/posts/'+ id);
  }
  addPosts(title:string,content:string){
    const post: post ={id:null,title:title,content:content};
    this.http.post<{message: string, postId:string}>('http://localhost:3000/api/posts',post)
    .subscribe((responseData)=>{
      console.log(responseData);
      const id = responseData.postId;
      post.id=id;
      this.posts.push(post)
      this.postUpdated.next([...this.posts])
    })

  }

  updatePost(id:string, title:string, content:string){
    const post:post={id:id,title:title,content:content}
    this.http.put('http://localhost:3000/api/posts/'+ id,post)
    .subscribe(response=>{
        console.log("updated post",response )
        const updatedPost=[...this.posts]
        const olpPostIndex=updatedPost.findIndex(p=>p.id===post.id)
        updatedPost[olpPostIndex]=post
        this.posts=updatedPost
        this.postUpdated.next([...this.posts]);
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
