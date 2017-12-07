import {Component, OnInit} from "@angular/core";
import {AdminDashboardService} from "../admin-dashboard.service";
import {Router} from "@angular/router";
import {Messages, Label, AppSettings} from "../../../shared/constants";
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

export class CandidateDetailListComponent implements OnInit {
  candidates: any[] = new Array(0);
  private successMessage: string;

  constructor(private adminDashboardService: AdminDashboardService,
              private loaderService: LoaderService,
              private errorService: ErrorService,
              private messageService: MessageService,
              private _router: Router) {

  }

  ngOnInit() {
    this.loaderService.start();
    this.getAllCandidates();
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
          window.open(AppSettings.IP + CandidateDetails.path.candidateProfilesCSV, '_blank');
          window.open(AppSettings.IP + CandidateDetails.path.candidateCapabilitiesCSV, '_blank');
          window.open(AppSettings.IP + CandidateDetails.path.candidateAccountDetailsCSV, '_blank');
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

  getAllCandidates() {
    this.adminDashboardService.getAllCandidates("a")
      .subscribe(
        candidateProfile => this.onGetAllCandidateSuccess(candidateProfile),
        error => this.errorService.onError(error));
  }

  onGetAllCandidateSuccess(candidateProfile: any) {
    this.candidates = candidateProfile.data.candidate;
    this.loaderService.stop();
  }

  loadUser(letter: string) {
    this.loaderService.start();
    this.adminDashboardService.getAllCandidates(letter)
      .subscribe(
        candidateProfile => this.onGetAllCandidateSuccess(candidateProfile),
        error => this.errorService.onError(error));
  }
}



