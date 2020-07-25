import { stringify } from 'querystring';
import { LoggingService } from './logging.service';
import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class AccountService{
    accounts = [
        {
          name: 'Master Account',
          status: 'active'
        },
        {
          name: 'Testaccount',
          status: 'inactive'
        },
        {
          name: 'Hidden Account',
          status: 'unknown'
        }
      ];
      // Added for cross component communication with event.
      @Output() statusUpdated = new EventEmitter<string>();
      constructor(private loggingService:LoggingService){}

      addAccount(name: string, status: string){
        this.accounts.push({name: name, status: status});
        this.loggingService.logStatusChange(status)
      }
      updateAccount(id: number, newStatus: string){
        this.accounts[id].status = newStatus;
        this.loggingService.logStatusChange(newStatus)
      }
}