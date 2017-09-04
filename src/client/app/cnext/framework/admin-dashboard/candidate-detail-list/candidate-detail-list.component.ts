import {Component, Input} from "@angular/core";
import {AdminDashboardService} from "../admin-dashboard.service";
import {ErrorService} from "../../error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-detail-list',
  templateUrl: 'candidate-detail-list.component.html',
  styleUrls: ['candidate-detail-list.component.css'],
})

export class CandidateDetailListComponent {
  @Input() candidates:any[]=new Array(0);
  constructor(private adminDashboardService:AdminDashboardService, private errorService:ErrorService) {

  }
  updateDetail(index:number,candidate:any,activated:boolean) {
    console.log('can',candidate);
    console.log(activated);
    candidate.isActivated=!activated;
    candidate.user_id=candidate._id;
    console.log('candi',candidate);
    this.adminDashboardService.updateUser(candidate).subscribe(
      data => {
        this.onUpdateComplete(index,data.data,activated);
      }, error => this.errorService.onError(error));
  }
  onUpdateComplete(index:number,candidate:any,activated:boolean) {
    console.log('candidate',candidate);
    this.candidates[index].isActivated=!activated;
  }
}



