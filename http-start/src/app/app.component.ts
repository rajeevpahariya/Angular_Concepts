import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Post } from './post.model'
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  apiEndPoint : string = 'https://ng-complete-guide-456f5.firebaseio.com/posts.json';
  isFetching = false;
  errorMessage = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postService : PostsService) {}
  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  ngOnInit() {
    this.errorSub = this.postService.error.subscribe(errorMessage => {
      this.errorMessage = errorMessage;
    });

    this.isFetching = true;
    this.postService.fetchPosts().subscribe(
      posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      error => {
        this.isFetching = false;
        this.errorMessage = error.message;
      }
    );
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndStorePost(postData);
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error =>{
        this.errorMessage = error.message;
    });
  }

  onClearPosts() {
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  // private fetchPosts(){
  //   this.http.get(this.apiEndPoint).subscribe( posts => {
  //     console.log(posts);
  //   });
  // }

  // Added below method with observable operators.
  private fetchPosts(){
    this.isFetching = true;
    // 1 way to define the response type in map method
    // this.http.get(this.apiEndPoint)
    // .pipe(map((responseData: {[kye : string] : Post}) => {
    //   const postArray: Post[] = [];
    //   for(const key in responseData){
    //     if(responseData.hasOwnProperty(key)){
    //       postArray.push( {...responseData[key], id: key});
    //     }
    //   }
    //   return postArray;
    // })).subscribe( posts => {
    //   console.log(posts);
    // });

    // 2nd way in get<>, moved to service class

    this.http.get<{[kye : string] : Post}>(this.apiEndPoint)
    .pipe(map(responseData => {
      const postArray: Post[] = [];
      for(const key in responseData){
        if(responseData.hasOwnProperty(key)){
          postArray.push( {...responseData[key], id: key});
        }
      }
      return postArray;
    })).subscribe( posts => {
      this.isFetching = false;
      this.loadedPosts = posts
    });
  }
}
