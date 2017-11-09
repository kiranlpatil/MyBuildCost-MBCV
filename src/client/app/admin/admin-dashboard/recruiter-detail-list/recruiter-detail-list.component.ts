import {Component, Input} from "@angular/core";
import { ErrorService } from '../../../shared/services/error.service';
import {AdminDashboardService} from "../admin-dashboard.service";
import {Router} from "@angular/router";
import {LoaderService} from "../../../shared/loader/loaders.service";
import {MessageService} from "../../../shared/services/message.service";
import {Message} from "../../../shared/models/message";
import {Label, Messages} from "../../../shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-detail-list',
  templateUrl: 'recruiter-detail-list.component.html',
  styleUrls: ['recruiter-detail-list.component.css'],
})

export class RecruiterDetailListComponent {
  @Input() recruiters:any[]=new Array(0);
  private successMessage:string;
  recruitersCSV: string = '';
  recruitersUsersCSV: string = '';
  constructor(private adminDashboardService:AdminDashboardService,
              private loaderService: LoaderService,
              private errorService: ErrorService,
              private messageService: MessageService,
              private _router:Router) {

  }
  updateDetail(index:number,recruiter:any,activated:boolean) {
    this.loaderService.start();
    recruiter.isActivated=!activated;
    recruiter.user_id=recruiter._id;
    this.adminDashboardService.updateUser(recruiter).subscribe(
      data => {
        this.onUpdateComplete(index,data.data,activated);
      }, error => {
        this.loaderService.stop();
        this.errorService.onError(error);
      });
  }
  onUpdateComplete(index:number,recruiter:any,activated:boolean) {
    if(this.recruiters[index].isActivated) {
      this.successMessage=' activated.';
    } else {
      this.successMessage=' deactivated.';
    }
    this.messageService.message(new Message(this.recruiters[index].data.company_name+' is now'+this.successMessage));
    this.recruiters[index].isActivated=!activated;
    this.loaderService.stop();
  }
  generateRecruiterDetailFile() {
    this.loaderService.start();
    this.messageService.message(new Message(Messages.MSG_FOR_FILE_DOWNLOAD));
    this.adminDashboardService.generateRecruiterDetailFile()
      .subscribe(
        recruiterDetails => {
          this.loaderService.stop();
          this.recruitersCSV = recruiterDetails.candidatesOtherDetailsFilePath;
          this.recruitersUsersCSV = recruiterDetails.usersFilePath;
          document.getElementById('link_recruiter').click();
          document.getElementById('link_recruiter1').click();
          this.messageService.message(new Message(Messages.MSG_SUCCESS_FOR_FILE_DOWNLOAD));
        },
        error => this.errorService.onError(error));
  }
  viewProfile(recruiter:any,nav:string) {
    if (nav !== undefined) {
      this._router.navigate([nav, recruiter._id]);
    }
  }

  getLabel() {
    return Label;
  }

  getMessages() {
    return Messages;
  }
}



