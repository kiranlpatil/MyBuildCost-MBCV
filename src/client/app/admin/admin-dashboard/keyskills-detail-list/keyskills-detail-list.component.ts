import { Component } from '@angular/core';
import { AdminDashboardService } from '../admin-dashboard.service';
import { ErrorService } from '../../../shared/services/error.service';
import { LoaderService } from '../../../shared/loader/loaders.service';
import {Messages, AppSettings} from  '../../../shared/constants';
import { Message } from '../../../shared/models/message';
import { MessageService } from '../../../shared/services/message.service';

@Component({
  moduleId: module.id,
  selector: 'cn-key-skills-detail-list',
  templateUrl: 'keyskills-detail-list.component.html',
  styleUrls: ['keyskills-detail-list.component.css'],
})

export class KeySkillsDetailListComponent {
  keySkillCSV: string= '';
  constructor(private adminDashboardService: AdminDashboardService,
              private loaderService: LoaderService,
              private errorService: ErrorService,
              private messageService: MessageService) {
  }

  getKeySkillsData() {
    this.messageService.message(new Message(Messages.MSG_FOR_FILE_DOWNLOAD));
    this.loaderService.start();
    this.adminDashboardService.getKeySkillsData()
      .subscribe(
        data => {
          this.loaderService.stop();
          window.open(AppSettings.IP + data.path,'_self');
          this.messageService.message(new Message(Messages.MSG_SUCCESS_FOR_FILE_DOWNLOAD));
          },
        error => {
          this.loaderService.stop();
          this.errorService.onError(error);
        });
  }
}



