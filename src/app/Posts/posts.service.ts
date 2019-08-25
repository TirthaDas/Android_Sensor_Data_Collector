import { Router } from '@angular/router';
import { post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class PostsService {

  private posts: post[] = [];
  private postUpdated = new Subject<{posts:post[],postCount:number}>()

  constructor(private http: HttpClient, public router: Router, private _snackBar: MatSnackBar) { }

  getPosts(postsPerPage, currentPage) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              creator:post.creator

            };
          }),
          maxPosts: postData.maxPosts
        }
      }))
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postUpdated.next({
          posts:[...this.posts],
          postCount:transformedPostData.maxPosts 
        });
      }
      )
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable()
  }
  getPost(id: string) {
    return this.http.get<{
      posts: { _id: string, title: string, content: string, sensorList: string[], duration: string },
      questions: [{ question: string }, { question: string }, { question: string }, { question: string }, { question: string }],creator:string
    }>('http://localhost:3000/api/posts/' + id);
  }
  addPosts(title: string, content: string, duration: string, sensorType: string[], firstQuestion: string, secondQuestion: string, thirdQuestion: string, fourthQuestion: string, fifthQuesiton: string) {
    const post: post = { id: null, title: title, content: content, duration: duration, sensorType: sensorType, FirstQuestion: firstQuestion, SecondQuestion: secondQuestion, ThirdQuestion: thirdQuestion, FourthQuestion: fourthQuestion, FifthQuestion: fifthQuesiton,creator:null };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        this.router.navigate(["/"])
          .then(() => {
            this.openSnackBar("project created successfully", "close")
          })
      })

  }

  updatePost(id: string, title: string, content: string) {
    const post: post = { id: id, title: title, content: content, duration: "", sensorType: ["sensorType"], FirstQuestion: "firstQuestion", SecondQuestion: "secondQuestion", ThirdQuestion: "thirdQuestion", FourthQuestion: "fourthQuestion", FifthQuestion: "fifthQuesiton" , creator:null}
    console.log("update called", post)

    this.http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        this.router.navigate(["/"])
          .then(() => {
            this.openSnackBar("project updated successfully", "close")
          })

      })
  }

  deletePost(postId: string) {
    console.log('delete called', postId)
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
      // .subscribe(responseData => {
      //   const updatedPost = this.posts.filter(post =>
      //     post.id !== postId
      //   )
      //   this.posts = updatedPost;
      //   this.postUpdated.next([...this.posts])
      //   this.openSnackBar("project deleted successfully", "close")
      // })
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
