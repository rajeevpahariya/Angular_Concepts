import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers', // always suggestable
  //selector: '[app-servers]'  attibute style, 
  //selector: '.app-servers' class style,
  //template : '<app-server></app-server> <app-server></app-server>',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  allowAddServer = false;
  serverCreationStatus = 'Server creation failed';
  serverName = 'test';
  serverCreated = false;
  servers = ['server 1',' server 2'];
  constructor() { 
    setTimeout(() => {
      this.allowAddServer = true;
    } ,2000);
  }

  ngOnInit(): void {
  }

  onServerCreation(){
    //this.serverCreationStatus = 'Server Created Successfully';
    this.serverCreated = true;
    this.servers.push(this.serverName);
    this.serverCreationStatus = 'Server Created Successfully ! and Name is ' + this.serverName;
  }

  onUpdateServerName(event : Event) {
    //console.log(event)
    this.serverName = (<HTMLInputElement>event.target).value; // Casting to HTMLinputEement.
  }

}
