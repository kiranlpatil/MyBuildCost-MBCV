import {Injectable, ElementRef} from "@angular/core";
import {JobPosterModel} from "../models/jobPoster";
import {MessageService} from "../../shared/services/message.service";
import {Message} from "../../shared/models/message";
import {JobPosterService} from "../../cnext/framework/job-poster/job-poster.service";
import {ErrorService} from "../../cnext/framework/error.service";
import {Messages} from "../../shared/constants";


@Injectable()

export class RenewJobPostService {

  private selectedJobProfile: JobPosterModel = new JobPosterModel();

  constructor(private errorService: ErrorService, private messageService: MessageService,
              private jobPostService: JobPosterService ) {

  }

  checkJobPostExpiryDate(selectedJobProfile: any) {
    if (selectedJobProfile.daysRemainingForExpiring <= 0 && selectedJobProfile.daysRemainingForExpiring > -31) {
      this.messageService.message(new Message(Messages.RENEW_JOB_POST_MSG));
    }
  }

  onRenewJob(selectedJobProfile: JobPosterModel) { debugger
    this.selectedJobProfile = selectedJobProfile;
    if (this.selectedJobProfile.daysRemainingForExpiring > -31) {
      this.selectedJobProfile.expiringDate = new Date(this.selectedJobProfile.expiringDate);
      this.selectedJobProfile.expiringDate.setDate(this.selectedJobProfile.expiringDate.getDate() + 30);
      this.updateJob();
    }else { debugger
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