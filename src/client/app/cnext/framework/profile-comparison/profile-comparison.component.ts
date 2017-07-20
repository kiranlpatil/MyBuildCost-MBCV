import {Component} from "@angular/core";
import {JobCompareService} from "../single-page-compare-view/job-compare-view/job-compare-view.service";

@Component({
  moduleId:module.id,
  selector:'cn-profile-comparison',
  templateUrl:'profile-comparison.component.html',
  styleUrls:['profile-comparison.component.scss']
})

export class ProfileComparisonComponent {

  private data:any;
  constructor(private jobCompareService:JobCompareService) {

  }

  getCompareDetail(candidateId: string, recruiterId: string) {
    this.jobCompareService.getCompareDetail('5969a7744265188020370e5e', '596f2ad12148a9441e647344')
      .subscribe(
        data => this.OnCompareSuccess(data),
        error => console.log(error));
  }

  OnCompareSuccess(data: any) { debugger
    this.data = data.data;
    //this.capabilities= this.jobCompareService.getStandardMatrix(this.data.match_map);
  }


}
