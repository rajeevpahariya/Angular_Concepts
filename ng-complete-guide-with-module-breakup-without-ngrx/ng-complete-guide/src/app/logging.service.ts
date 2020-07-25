import { Injectable } from '@angular/core';
// Below service is created just to verify what will happen if injectc service as
// - Root level, coponent level, eager loaded module or lazy loaded module
//@Injectable({providedIn : "root"}) - adding in now in app module
export class LoggingService{
    lastLog : string;
    printLog(message : string){
        console.log("Current Log : "+ message);
        console.log("Last Log : "+ this.lastLog);
        this.lastLog = message;
    }
}