import {Component, Input} from "@angular/core";
import { ErrorService } from '../../../shared/services/error.service';
import {AdminDashboardService} from "../admin-dashboard.service";
import {Router} from "@angular/router";
import {LoaderService} from "../../../shared/loader/loaders.service";
import {MessageService} from "../../../shared/services/message.service";
import {Message} from "../../../shared/models/message";
import {AppSettings, Label, Messages} from "../../../shared/constants";
import {JobPosterModel} from "../../../user/models/jobPoster";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-detail-list',
  templateUrl: 'recruiter-detail-list.component.html',
  styleUrls: ['recruiter-detail-list.component.css'],
})

export class RecruiterDetailListComponent {
  @Input() recruiters:any[]=new Array(0);
  @Input() jobs: string[] = new Array(0);
  private successMessage:string;
  constructor(private adminDashboardService:AdminDashboardService,
              private loaderService: LoaderService,
              private errorService: ErrorService,
              private messageService: MessageService,
              private _router:Router) {

  }

  ngOnInit() {
    this.loaderService.start();
    this.getAllRecruiters();
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
          window.open(AppSettings.IP + recruiterDetails.path.companyDetailsCSV,'_blank');
          window.open(AppSettings.IP + recruiterDetails.path.jobDetailsCSV,'_blank');
          window.open(AppSettings.IP + recruiterDetails.path.companyAccountDetailsCSV,'_blank');
        },
        error => this.errorService.onError(error));
  }
  viewProfile(recruiter:any,nav:string) {
    if (nav !== undefined) {
      this._router.navigate([nav, recruiter._id]);
    }
  }

  getAllRecruiters() {
    this.adminDashboardService.getAllRecruiters("a")
      .subscribe(
        recruiterProfile => this.onGetAllRecruiterSuccess(recruiterProfile),
        error => this.errorService.onError(error));
  }
  onGetAllRecruiterSuccess(recruiterProfile: any) {
    this.recruiters = recruiterProfile.data.recruiter;
    this.loaderService.stop();
  }

  loadUser(letter: string) {
   this.loaderService.start();
   this.adminDashboardService.getAllRecruiters(letter)
   .subscribe(
   recruiterProfile => this.onGetAllRecruiterSuccess(recruiterProfile),
   error => this.errorService.onError(error));
   }

  getLabel() {
    return Label;
  }

  getMessages() {
    return Messages;
  }
}



