import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {ProfileComparisonData} from "../../model/profile-comparison";
import {CandidateQCard} from "../../model/candidateQcard";
import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";
import {Router} from '@angular/router';
import {UsageTrackingService} from "../../usage-tracking.service";
import {ErrorService} from "../../../../shared/services/error.service";
import {UsageActions, LocalStorage} from "../../../../shared/constants";
import {LocalStorageService} from "../../../../shared/services/localstorage.service";
import {UsageTracking} from "../../model/usage-tracking";
declare let $: any;
@Component({
  moduleId:module.id,
  selector:'cn-profile-comparison-header',
  templateUrl:'profile-comparison-header.component.html',
  styleUrls: ['profile-comparison-header.component.css']
})

export class ProfileComparisonHeaderComponent implements OnInit {

  @Input() profileComparisonResult: ProfileComparisonData[];
  @Input() listOfCandidateStatus: any[];
  @Input() jobId: string;
  @Output() actionOnComparisonList = new EventEmitter();

  constructor(private _router:Router,private profileCreatorService: CandidateProfileService,
              private usageTrackingService : UsageTrackingService,
              private errorService: ErrorService) {

  }

    ngOnInit() {
        $('.compare-candidate-container').scroll(function () {
            $(this).find('.matching-capabilities').css('left', $(this).scrollLeft());
        });
    }

  actionToPerformOnCompareList(action: string, item: ProfileComparisonData) {
    var data = {'action': action, 'item': item};
    this.actionOnComparisonList.emit(data);
   }

  navigateWithId(nav: string, type: string, candidate: CandidateQCard) {
    this.profileCreatorService.getCandidateDetailsOfParticularId(candidate._id).subscribe(
      candidateData => {
        this._router.navigate([nav, candidateData.data.userId,{jobId: this.jobId, type: type}]);
      });
  }

  navigateToApplicantSearch(nav: string, candidate: any) {
    let usageTrackingData: UsageTracking = new UsageTracking();
    usageTrackingData.recruiterId = LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
    usageTrackingData.jobProfileId = this.jobId;
    usageTrackingData.candidateId = candidate._id;
    usageTrackingData.action = UsageActions.MATCHED_CANDIDATE_AGAINST_ALL_JOB_BY_RECRUITER;
    this.usageTrackingService.addUsesTrackingData(usageTrackingData).subscribe(
      data => {

      },
      err => {
        this.errorService.onError(err);
      });
      this._router.navigate([nav, candidate._id]);
    }

}
