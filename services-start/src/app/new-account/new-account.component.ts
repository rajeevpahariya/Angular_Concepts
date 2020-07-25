import { Component} from '@angular/core';
import { LoggingService } from '../logging.service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  //providers: [LoggingService,AccountService]
  // A we added here AccountService in providers and it will override provided by app component,
  // But we dont need here as we need one instance to use the account data.
  //Dont need below provider as added in app module.
  //providers: [LoggingService]
})
export class NewAccountComponent {
  //@Output() accountAdded = new EventEmitter<{name: string, status: string}>();

  constructor(private loggingService:LoggingService, private accountService: AccountService){
    this.accountService.statusUpdated.subscribe(
      (status: string) => {alert(status)}
    );
  }

  onCreateAccount(accountName: string, accountStatus: string) {
    // this.accountAdded.emit({
    //   name: accountName,
    //   status: accountStatus
    // });
    // 1 - Below we created the instance of service and its not good practice.
    // const service = new LoggingService();
    // service.logStatusChange(accountStatus);
    this.accountService.addAccount(accountName,accountStatus);
    // dont need this as logging is injecting in account service
    //this.loggingService.logStatusChange(accountStatus);
  }
}
