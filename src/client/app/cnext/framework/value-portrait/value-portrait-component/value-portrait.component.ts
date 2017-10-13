import {AfterViewChecked, Component, Input, OnInit} from "@angular/core";
import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";
import {Candidate} from "../../../../user/models/candidate";
import {ErrorService} from "../../../../shared/services/error.service";
import {Headings, ImagePath, LocalStorage, Messages} from "../../../../shared/constants";
import {LocalStorageService} from "../../../../shared/services/localstorage.service";
import {GuidedTourService} from "../../guided-tour.service";

@Component({
  moduleId: module.id,
  selector: 'cn-value-portrait',
  templateUrl: 'value-portrait.component.html',
  styleUrls: ['value-portrait.component.css']
})

export class ValuePortraitComponent implements OnInit {

  candidate: Candidate = new Candidate();
  @Input() userId:string;
  @Input() isShareView:boolean;
  gotItMessage: string= Headings.GOT_IT;
  isCandidate:boolean;
  valuePortraitImgName:string;
  guidedTourStatus:string[] = new Array(0);
  constructor(private guidedTourService:GuidedTourService,private candidateProfileService: CandidateProfileService,private errorService:ErrorService) {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
  }

  ngOnInit(): void {
    this.candidateProfileService.getCandidateAllDetails(this.userId)
      .subscribe(
        candidateData => {
          this.candidate = this.updateCapabilityData(candidateData.data);
          this.valuePortraitImgName = ImagePath.CANDIDATE_VALUE_PORTRAIT_VIEW;
          if(this.isCandidate) {
            this.isRequireGuidedTourImg();
          }
        },error => this.errorService.onError(error));
  }

  isRequireGuidedTourImg() {
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
  }

  tourGuideGotIt() {
    this.guidedTourStatus = this.guidedTourService.updateTourStatus(ImagePath.CANDIDATE_VALUE_PORTRAIT_VIEW, true);
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
    this.guidedTourService.updateProfileField(this.guidedTourStatus)
      .subscribe(
        (res:any) => {
          LocalStorageService.setLocalValue(LocalStorage.GUIDED_TOUR, JSON.stringify(res.data.guide_tour));
        },
        error => this.errorService.onError(error)
      );

  }

  updateCapabilityData(candidate: Candidate) {
    for (var i = candidate.capabilities.length - 1; i >= 0; i--) {
      for (var j = candidate.capabilities[i].complexities.length - 1; j >= 0; j--) {
        if (candidate.capabilities[i].complexities[j].answer == undefined || candidate.capabilities[i].complexities[j].answer == 'Not Applicable') {
          candidate.capabilities[i].complexities.splice(j, 1);
        }
      }
      if (candidate.capabilities[i].complexities.length == 0) {
        candidate.capabilities.splice(i, 1);
      }
    }

    return candidate;
  }

  getMessage() {
    return Messages;
  }

  getHeadings() {
    return Headings;
  }

}
