import { Component, OnInit } from '@angular/core';
import { AccountService } from './account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // providers : [AccountService] - dont need this as injecting in app module
})
export class AppComponent implements OnInit{
  // Moved to account service class.
  // accounts = [
  //   {
  //     name: 'Master Account',
  //     status: 'active'
  //   },
  //   {
  //     name: 'Testaccount',
  //     status: 'inactive'
  //   },
  //   {
  //     name: 'Hidden Account',
  //     status: 'unknown'
  //   }
  // ];
  accounts : {name:string,status:string}[] = [];
  
  constructor(private accountService: AccountService){}
  ngOnInit(){
    this.accounts = this.accountService.accounts;
  }

  // onAccountAdded(newAccount: {name: string, status: string}) {
  //   // -  Moved to account service class.    this.accounts.push(newAccount);
  // }

  // onStatusChanged(updateInfo: {id: number, newStatus: string}) {
  //   //  Moved to account service class.    this.accounts[updateInfo.id].status = updateInfo.newStatus;
  // }
}
