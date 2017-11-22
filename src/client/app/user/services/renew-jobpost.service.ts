import {Injectable} from "@angular/core";
import {JobPosterModel} from "../models/jobPoster";
import {MessageService} from "../../shared/services/message.service";
import {Message} from "../../shared/models/message";
import {JobPosterService} from "../../cnext/framework/job-poster/job-poster.service";
import {Messages} from "../../shared/constants";
import {ErrorService} from "../../shared/services/error.service";


@Injectable()

export class RenewJobPostService {

  private selectedJobProfile: JobPosterModel = new JobPosterModel();

  constructor(private errorService: ErrorService, private messageService: MessageService,
              private jobPostService: JobPosterService) {

  }

  checkJobPostExpiryDate(selectedJobProfile: any) {
    if (selectedJobProfile.daysRemainingForExpiring <= 0 && selectedJobProfile.daysRemainingForExpiring > -31) {
      this.messageService.message(new Message(Messages.RENEW_JOB_POST_MSG));
    }
  }

  onRenewJob(selectedJobProfile: JobPosterModel) {
    this.selectedJobProfile = selectedJobProfile;
    if (this.selectedJobProfile.daysRemainingForExpiring > -31 && this.selectedJobProfile.daysRemainingForExpiring < 1) {
      this.selectedJobProfile.expiringDate = new Date();
      this.selectedJobProfile.expiringDate.setDate(this.selectedJobProfile.expiringDate.getDate() + 30);
      this.updateJob();
    } else if (this.selectedJobProfile.daysRemainingForExpiring > 0 && this.selectedJobProfile.daysRemainingForExpiring < 31) {
      this.selectedJobProfile.expiringDate = new Date(this.selectedJobProfile.expiringDate);
      this.selectedJobProfile.expiringDate.setDate(this.selectedJobProfile.expiringDate.getDate() + 30);
      this.updateJob();
    } else {
      let message = new Message();
      message.isError = true;
      message.error_msg = Messages.UNABLE_TO_RENEW_JOB_POST_MSG;
      this.messageService.message(message);
    }

  }

  updateJob() {
    this.jobPostService.postJob(this.selectedJobProfile).subscribe(
      data => {
        this.selectedJobProfile = data;
        this.messageService.message(new Message('You have successfully renewed ' + this.selectedJobProfile.jobTitle + 'Job by ' + '30 days'));
      }, error => this.errorService.onError(error));
  }

}
