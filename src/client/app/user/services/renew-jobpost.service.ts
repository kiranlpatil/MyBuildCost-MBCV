import {Injectable, ElementRef} from "@angular/core";
import {JobPosterModel} from "../models/jobPoster";
import {MessageService} from "../../shared/services/message.service";
import {Message} from "../../shared/models/message";
import {JobPosterService} from "../../cnext/framework/job-poster/job-poster.service";
import {ErrorService} from "../../cnext/framework/error.service";
import {Messages, UsageActions, LocalStorage} from "../../shared/constants";
import {UsageTrackingService} from "../../cnext/framework/usage-tracking.service";
import {LocalStorageService} from "../../shared/services/localstorage.service";


@Injectable()

export class RenewJobPostService {

  private selectedJobProfile: JobPosterModel = new JobPosterModel();

  constructor(private errorService: ErrorService, private messageService: MessageService,
              private jobPostService: JobPosterService, private usageTrackingService : UsageTrackingService ) {

  }

  checkJobPostExpiryDate(selectedJobProfile: any) {
    if (selectedJobProfile.daysRemainingForExpiring <= 0 && selectedJobProfile.daysRemainingForExpiring > -31) {
      this.messageService.message(new Message(Messages.RENEW_JOB_POST_MSG));
    }
  }

  onRenewJob(selectedJobProfile: JobPosterModel) { 
    this.selectedJobProfile = selectedJobProfile;
    if (this.selectedJobProfile.daysRemainingForExpiring > -31) {
      this.selectedJobProfile.expiringDate = new Date(this.selectedJobProfile.expiringDate);
      this.selectedJobProfile.expiringDate.setDate(this.selectedJobProfile.expiringDate.getDate() + 30);
      this.updateJob();
      this.usageTrackingService.addUsesTrackingData(UsageActions.RENEWED_JOB_POST_BY_RECRUITER,
        LocalStorageService.getLocalValue(LocalStorage.END_USER_ID),LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID), undefined).subscribe(
        data=> {
          console.log('');
        },
        err=> {
          this.errorService.onError(err);
        }
      );
    }else {
      this.messageService.message(new Message(Messages.UNABLE_TO_RENEW_JOB_POST_MSG));
    }

  }

  updateJob() {
    this.jobPostService.postJob(this.selectedJobProfile).subscribe(
      data => {
        this.selectedJobProfile = data.data.postedJobs[0];
        this.messageService.message(new Message('You have successfully renewed ' + this.selectedJobProfile.jobTitle + 'Job by '+ '30 days'));
      }, error => this.errorService.onError(error));
  }

}