import {Component} from "@angular/core";
import {AdminDashboardService} from "../admin-dashboard.service";
import {ErrorService} from "../../error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-keyskills-detail-list',
  templateUrl: 'keyskills-detail-list.component.html',
  styleUrls: ['keyskills-detail-list.component.css'],
})

export class KeyskillsDetailListComponent {
  constructor(private adminDashboardService:AdminDashboardService, private errorService:ErrorService) {

  }
  getUsageDetails() {
    this.adminDashboardService.getUsageDetails()
      .subscribe(
        UsageDetails => this.onSuccess(UsageDetails),
        error => this.errorService.onError(error));
  }
  onSuccess(UsageDetails:any) {
    document.getElementById('link').click();
    //console.log(UsageDetails);
  }
}



