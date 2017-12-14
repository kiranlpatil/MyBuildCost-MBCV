import {Component} from "@angular/core";
import {Button, Messages} from "../../../../shared/constants";
import {ManageCandidatesService} from "../manage-candidates.service";
import {ErrorService} from "../../../../shared/services/error.service";
import {ManagedCandidatesSummary} from "../../model/managed-candidates-summary";

@Component({
  moduleId: module.id,
  selector: 'cn-my-career-page',
  templateUrl: 'my-career-page.component.html',
  styleUrls: ['my-career-page.component.css']
})

export class MyCareerPageComponent {

  public fromDate: string = '';
  public toDate: string = '';
  public inValidDates: boolean = false;
  public summary: ManagedCandidatesSummary = new ManagedCandidatesSummary();

  constructor(private manageCandidatesService: ManageCandidatesService, private errorService: ErrorService) {

  }

  loadSummary() {
    this.inValidDates = false;
    if (this.fromDate != '' && this.toDate != '') {
      if (new Date(this.fromDate) <= new Date(this.toDate)) {
        this.manageCandidatesService.getMyCareerPageSummary(this.fromDate, this.toDate)
          .subscribe(
            data => {
              this.summary = data.summary;
            },
            (error: Error) => {
              this.errorService.onError(error);
            }
          );
      } else {
        this.summary = new ManagedCandidatesSummary();
        this.inValidDates = true;
      }
    }
  }

  getButtons() {
    return Button;
  }

  getMessages() {
    return Messages;
  }
}
