import { Component, Input } from '@angular/core';
import { LoggingService } from '../logging.service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  //providers: [LoggingService,AccountService]
  // A we added here AccountService in providers and it will override provided by app component,
  // But we dont need here as we need one instance to use the account data.
  //Dont need below provider as added in app module.
  //providers: [LoggingService]
})
export class AccountComponent {
  @Input() account: {name: string, status: string};
  @Input() id: number;
  //@Output() statusChanged = new EventEmitter<{id: number, newStatus: string}>();  
  //- Dont needd now as account service added

  constructor(private loggingService:LoggingService, private accountService:AccountService){}
  onSetTo(status: string) {
    //this.statusChanged.emit({id: this.id, newStatus: status});
    this.accountService.updateAccount(this.id,status)
    this.accountService.statusUpdated.emit();
    //this.loggingService.logStatusChange(status);
  }
}
