import { post } from './post.model';
import {Injectable} from '@angular/core'

@Injectable({providedIn:'root'})
export class PostsService {
  private posts: post[] = [] ;
  getPosts(){
    return [...this.posts];
  }
  addPosts(title:string,content:string){
    const post: post ={title:title,content:content};
    this.posts.push(post)
  }
}
