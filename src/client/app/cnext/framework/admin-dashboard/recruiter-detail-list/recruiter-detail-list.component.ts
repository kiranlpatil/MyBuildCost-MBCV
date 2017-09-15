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
    recruiter.isActivated=!activated;
    recruiter.user_id=recruiter._id;
    this.adminDashboardService.updateUser(recruiter).subscribe(
      data => {
        this.onUpdateComplete(index,data.data,activated);
      }, error => this.errorService.onError(error));
  }
  onUpdateComplete(index:number,recruiter:any,activated:boolean) {
    this.recruiters[index].isActivated=!activated;
  }
  generateRecruiterDetailFile() {
    this.adminDashboardService.generateRecruiterDetailFile()
      .subscribe(
        UsageDetails => this.onSuccess(UsageDetails),
        error => this.errorService.onError(error));
  }
  onSuccess(UsageDetails:any) {
    document.getElementById('link_recruiter').click();
  }
}



