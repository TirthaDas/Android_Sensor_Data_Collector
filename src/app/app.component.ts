import { Component } from '@angular/core';
import {post} from './Posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  srtoredposts:post[]=[];
  onPostAdded(post){
    this.srtoredposts.push(post);
  }
}
