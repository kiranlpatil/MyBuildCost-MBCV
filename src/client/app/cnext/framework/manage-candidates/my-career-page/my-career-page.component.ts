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

  public fromDate : string = '';
  public toDate : string = '';
  public inValidDates : boolean = false;
  public summary : ManagedCandidatesSummary = new ManagedCandidatesSummary();
  public noCandidatesToShow: boolean = false;

  constructor(private manageCandidatesService: ManageCandidatesService, private errorService: ErrorService) {

  }

  loadSummary(fromDate: string, toDate: string) {
    if (fromDate != '' && toDate != '') {
      if (new Date(fromDate) < new Date(toDate)) {
        this.manageCandidatesService.getMyCareerPageSummary(fromDate, toDate)
          .subscribe(
            data => {
              this.summary = data.data;
              if(this.summary.total == 0) {
                this.noCandidatesToShow = true;
              }
            },
            (error: Error) => {
              this.errorService.onError(error);
            }
          );
      } else {
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
