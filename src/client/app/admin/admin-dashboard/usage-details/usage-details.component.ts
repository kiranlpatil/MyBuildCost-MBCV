import { Component } from '@angular/core';
import { AdminDashboardService } from '../admin-dashboard.service';
import { ErrorService } from '../../../shared/services/error.service';
import { LoaderService } from '../../../shared/loader/loaders.service';
import { Messages } from  '../../../shared/constants';
import { Message } from '../../../shared/models/message';
import { MessageService } from '../../../shared/services/message.service';

@Component({
  moduleId: module.id,
  selector: 'cn-usage-details',
  templateUrl: 'usage-details.component.html',
  styleUrls: ['usage-details.component.css'],
})

export class UsageDetailsComponent {
  constructor(private adminDashboardService: AdminDashboardService,
              private loaderService: LoaderService,
              private errorService: ErrorService,
              private messageService: MessageService,) {
  }

  getUsageDetails() {
    this.messageService.message(new Message(Messages.MSG_FOR_FILE_DOWNLOAD));
    this.loaderService.start();
    this.adminDashboardService.getUsageDetails()
      .subscribe(
        UsageDetails => {
          this.loaderService.stop();
          document.getElementById('link').click();
          this.messageService.message(new Message(Messages.MSG_SUCCESS_FOR_FILE_DOWNLOAD));
          },
        error => {
          this.loaderService.stop();
          this.errorService.onError(error);
        });
  }
}



