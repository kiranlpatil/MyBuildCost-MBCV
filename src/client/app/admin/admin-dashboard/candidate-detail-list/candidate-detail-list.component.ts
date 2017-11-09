import {Component, Input} from "@angular/core";
import {AdminDashboardService} from "../admin-dashboard.service";
import {Router} from "@angular/router";
import {Messages, Label} from "../../../shared/constants";
import {Message} from "../../../shared/models/message";
import {MessageService} from "../../../shared/services/message.service";
import {LoaderService} from "../../../shared/loader/loaders.service";
import {ErrorService} from "../../../shared/services/error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-detail-list',
  templateUrl: 'candidate-detail-list.component.html',
  styleUrls: ['candidate-detail-list.component.css'],
})

export class CandidateDetailListComponent {
  @Input() candidates: any[] = new Array(0);
  private successMessage: string;
  candidateCSV: string = '';
  candidateOtherDetailsCSV: string = '';
  usersCSV: string = '';
  constructor(private adminDashboardService: AdminDashboardService,
              private loaderService: LoaderService,
              private errorService: ErrorService,
              private messageService: MessageService,
              private _router: Router) {

  }

  updateDetail(index: number, candidate: any, activated: boolean) {
    this.loaderService.start();
    candidate.isActivated = !activated;
    candidate.user_id = candidate._id;
    this.adminDashboardService.updateUser(candidate).subscribe(
      data => {
        this.onUpdateComplete(index, data.data, activated);
      }, error => {
        this.loaderService.stop();
        this.errorService.onError(error);
      });
  }

  onUpdateComplete(index: number, candidate: any, activated: boolean) {
    if (this.candidates[index].isActivated) {
      this.successMessage = ' activated.';
    } else {
      this.successMessage = ' deactivated.';
    }
    this.messageService.message(new Message(this.candidates[index].first_name + ' ' + this.candidates[index].last_name + ' is now' + this.successMessage));
    this.candidates[index].isActivated = !activated;
    this.loaderService.stop();
  }

  generateCandidateDetailFile() {
    this.messageService.message(new Message(Messages.MSG_FOR_FILE_DOWNLOAD));
    this.loaderService.start();
    this.adminDashboardService.generateCandidateDetailFile()
      .subscribe(
        CandidateDetails => {
          this.loaderService.stop();
          this.candidateCSV = CandidateDetails.candidatesFilePath;
          this.candidateOtherDetailsCSV = CandidateDetails.candidatesOtherDetailsFilePath;
          this.usersCSV = CandidateDetails.usersFilePath;
          document.getElementById('link_candidate').click();
          document.getElementById('link_candidate1').click();
          document.getElementById('link_candidate2').click();
          this.messageService.message(new Message(Messages.MSG_SUCCESS_FOR_FILE_DOWNLOAD));
        },
        error => {
          this.loaderService.stop();
          this.errorService.onError(error);
        });
  }

  viewProfile(candidate: any, nav: string) {
    if (nav !== undefined) {
      this._router.navigate([nav, candidate._id]);
    }
  }

  getLabel() {
    return Label;
  }

  getMessages() {
    return Messages;
  }
}



