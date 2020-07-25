import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Post } from './post.model';
import { Subject, throwError, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  apiEndPoint : string = 'https://ng-complete-guide-456f5.firebaseio.com/posts.json';
  error = new Subject<string>();
  
  constructor(private http : HttpClient) { }

  createAndStorePost(postData: Post){
    // post <> - added type of output
    //return this.http.post<{name : string}>(this.apiEndPoint,postData);
    this.http
      .post<{ name: string }>(
        this.apiEndPoint,
        postData,
        // Below code is added to have complete response
        {
          observe : 'response',
        }
      )
      .subscribe(
        responseData => {
          console.log(responseData);
        },
        error => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts(){
    // Param is immutable, hence needd variable (let)
    let searchParam = new HttpParams();
    searchParam = searchParam.append('print','preety');
    searchParam = searchParam.append('custom','key');
    return this.http
      .get<{ [key: string]: Post }>(
        this.apiEndPoint,{
          headers : new HttpHeaders({'custom-header' : 'Hello'}),
          // 1 wat to set param
          //params : new HttpParams().set('print','pretty')
          // 2nd way
          params : searchParam,
          responseType : 'json' // ex
        }
      )
      .pipe(
        map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError(errorRes => {
          // Send to analytics server
          return throwError(errorRes);
        })
      );
  }

  deletePosts(){
    return this.http.delete(
      this.apiEndPoint,{
        observe : 'events',
        responseType : 'text'
      }
      // tab method just allow to see the data but now allow to modify it
    ).pipe(tap(event => {
      console.log(event);
      // even can be used to check type of HttpEventType
      if(event.type === HttpEventType.Sent){
        console.log('sent')
      }
      if(event.type === HttpEventType.Response){
        console.log(event.body);
      }
    }));
  }
}
