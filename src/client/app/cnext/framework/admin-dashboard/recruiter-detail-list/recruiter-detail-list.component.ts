import {Component, Input} from "@angular/core";
import {ErrorService} from "../../error.service";
import {AdminDashboardService} from "../admin-dashboard.service";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-detail-list',
  templateUrl: 'recruiter-detail-list.component.html',
  styleUrls: ['recruiter-detail-list.component.css'],
})

export class RecruiterDetailListComponent {
  @Input() recruiters:any[]=new Array(0);
  constructor(private adminDashboardService:AdminDashboardService, private errorService:ErrorService) {

  }
  updateDetail(index:number,recruiter:any,activated:boolean) {
    console.log('can',recruiter);
    console.log(activated);
    recruiter.isActivated=!activated;
    recruiter.user_id=recruiter._id;
    console.log('candi',recruiter);
    this.adminDashboardService.updateUser(recruiter).subscribe(
      data => {
        this.onUpdateComplete(index,data.data,activated);
      }, error => this.errorService.onError(error));
  }
  onUpdateComplete(index:number,recruiter:any,activated:boolean) {
    console.log('recruiter',recruiter);
    this.recruiters[index].isActivated=!activated;
  }
}



