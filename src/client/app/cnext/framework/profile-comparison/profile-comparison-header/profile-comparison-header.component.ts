import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {ProfileComparisonData} from "../../model/profile-comparison";
import {CandidateQCard} from "../../model/candidateQcard";
import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";
import {Router} from '@angular/router';
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

  constructor(private _router:Router,private profileCreatorService: CandidateProfileService) {

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
      this._router.navigate([nav, candidate._id]);
    }
  
}
