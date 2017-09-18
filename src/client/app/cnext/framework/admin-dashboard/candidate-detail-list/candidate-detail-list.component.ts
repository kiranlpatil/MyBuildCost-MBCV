import { Component, Input } from '@angular/core';
import { AdminDashboardService } from '../admin-dashboard.service';
import { ErrorService } from '../../error.service';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-detail-list',
  templateUrl: 'candidate-detail-list.component.html',
  styleUrls: ['candidate-detail-list.component.css'],
})

export class CandidateDetailListComponent {
  @Input() candidates:any[]=new Array(0);
  constructor(private adminDashboardService:AdminDashboardService, private errorService:ErrorService, private _router:Router) {

  }
  updateDetail(index:number,candidate:any,activated:boolean) {
    candidate.isActivated=!activated;
    candidate.user_id=candidate._id;
    this.adminDashboardService.updateUser(candidate).subscribe(
      data => {
        this.onUpdateComplete(index,data.data,activated);
      }, error => this.errorService.onError(error));
  }
  onUpdateComplete(index:number,candidate:any,activated:boolean) {
    this.candidates[index].isActivated=!activated;
  }
  generateCandidateDetailFile() {
    this.adminDashboardService.generateCandidateDetailFile()
      .subscribe(
        UsageDetails => this.onSuccess(UsageDetails),
        error => this.errorService.onError(error));
  }
  onSuccess(UsageDetails:any) {
    document.getElementById('link_candidate').click();
  }
  viewProfile(candidate:any,nav:string) {
    if (nav !== undefined) {
      this._router.navigate([nav, candidate._id]);
    }
  }
}



