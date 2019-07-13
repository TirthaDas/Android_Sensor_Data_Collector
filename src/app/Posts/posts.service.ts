import { post } from './post.model';
import {Injectable} from '@angular/core'
import {Subject} from 'rxjs';

@Injectable({providedIn:'root'})
export class PostsService {

  private posts: post[] = [] ;
  private postUpdated =new Subject<post[]>()


  getPosts(){
    return [...this.posts];
  }

  getPostUpdateListener(){
  return  this.postUpdated.asObservable()
  }
  addPosts(title:string,content:string){
    const post: post ={title:title,content:content};
    this.posts.push(post)
    this.postUpdated.next([...this.posts])
  }
}
