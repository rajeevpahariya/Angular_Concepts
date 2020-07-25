import { Component, OnInit, OnDestroy, ErrorHandler } from '@angular/core';
import { interval, Subscription, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  firstObservable : Subscription;
  secondObservable : Subscription;
  constructor() { }
  

  ngOnInit() {
    // interval is provided by rxjs. Its not managed by angular to we have to
    // unsubscribe it once component is destroyed.
    this.firstObservable = interval(1000).subscribe(
      count => {
        console.log("Interval Observable :"+count);
      }
    );

    // Below is custom Observable
    // Set Interval is js function
    const customObservable = Observable.create(observer => {
      let count = 0;
      setInterval(() =>{
        observer.next(count);
        // Complete check
        if(count === 2){
          observer.complete();
        }
        // addinig below code to check throw an error and handle it.
        if(count > 3){
          observer.error(new Error("Count is greater than 3!"));  
        }
        count++;
      }, 1000);
    });

    // Adding operators (map and filter both). But it wont work as we are using old obervable
    this.secondObservable = customObservable.pipe(filter(data => {
      return data > 0;
    }) ,map((data : number) => {
      return "Round :" + (data +1);
    })).subscribe(data => {
      console.log(data);
    }, error => {
      console.log(error);
      alert(error.message);
    }, () => {
      console.log("Completed !")
    });

    this.secondObservable = customObservable.subscribe(data => {
      console.log("Custom Observable :" + data);
    }, error => {
      console.log(error);
      alert(error.message);
    }, () => {
      console.log("Completed !")
    });
  }

  ngOnDestroy(): void {
    this.firstObservable.unsubscribe();
    this.secondObservable.unsubscribe();
  }

}
