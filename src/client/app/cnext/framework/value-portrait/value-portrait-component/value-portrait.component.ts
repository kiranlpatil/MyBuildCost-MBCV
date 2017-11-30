import {Component, Input, Output, OnInit, EventEmitter} from "@angular/core";
import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";
import {Candidate} from "../../../../user/models/candidate";
import {ErrorService} from "../../../../shared/services/error.service";
import {Headings, ImagePath, Label, LocalStorage, Messages, UsageActions} from "../../../../shared/constants";
import {LocalStorageService} from "../../../../shared/services/localstorage.service";
import {GuidedTourService} from "../../guided-tour.service";
import {ComplexityAnsweredService} from "../../complexity-answered.service";
import {UsageTrackingService} from "../../usage-tracking.service";
import {UsageTracking} from "../../model/usage-tracking";
import {ActionOnQCardService} from "../../../../user/services/action-on-q-card.service";

@Component({
  moduleId: module.id,
  selector: 'cn-value-portrait',
  templateUrl: 'value-portrait.component.html',
  styleUrls: ['value-portrait.component.css']
})

export class ValuePortraitComponent implements OnInit {

  candidate: Candidate = new Candidate();
  @Input() userId: string;
  @Input() isShareView: boolean;
  @Input() isMiniView: boolean;
  @Output() candidateId: EventEmitter<string> = new EventEmitter<string>();
  gotItMessage: string = Headings.GOT_IT;
  isCandidate: boolean;
  isAdmin: boolean;
  isSubmitted: boolean;
  isAnswered: boolean;
  jobId: string;
  type: string;
  valuePortraitImgName: string;
  guidedTourStatus: string[] = new Array(0);

  constructor(private guidedTourService: GuidedTourService, private candidateProfileService: CandidateProfileService,
              private errorService: ErrorService, private complexityAnsweredService: ComplexityAnsweredService,
              private usageTrackingService: UsageTrackingService,
  private actionOnQCardService: ActionOnQCardService) {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
    if (LocalStorageService.getLocalValue(LocalStorage.ISADMIN) === 'true') {
      this.isAdmin = true;
    }
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE_SUBMITTED) === 'true') {
      this.isSubmitted = true;
    }
    this.actionOnQCardService.getJobId().subscribe(obj => {
      this.jobId = obj.jobId;
      this.type = obj.type;
    });
  }

  ngOnInit(): void {
    this.valuePortraitImgName = ImagePath.CANDIDATE_VALUE_PORTRAIT_VIEW;
    if (this.isCandidate) {
      this.isRequireGuidedTourImg();
    }
    // this.getCandidateAllDetails();
    if (this.isMiniView) {
      this.complexityAnsweredService.makeCall()
        .subscribe(isAnswered => {
          this.isAnswered = isAnswered;
          this.getCandidateAllDetails();
        });
    }
    this.getCandidateAllDetails();
    console.log('is miniVIew = ', this.isMiniView);
  }

  getCandidateAllDetails() {
    this.candidateProfileService.getCandidateAllDetails(this.userId)
      .subscribe(
        candidateData => {
          if (!this.isCandidate) {
            let usageTrackingData: UsageTracking = new UsageTracking();
            usageTrackingData.recruiterId = LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
            usageTrackingData.action = UsageActions.VIEWED_VALUE_PORTRAIT_BY_RECRUITER;
            usageTrackingData.candidateId = candidateData.data.candidateId;

            this.usageTrackingService.addUsesTrackingData(usageTrackingData).subscribe(
              error => this.errorService.onError(error));
          }
          this.candidateId.emit(candidateData.data.candidateId);
          this.candidate = this.updateCapabilityData(candidateData.data);
          console.log("capability details = ", this.candidate);
        }, error => this.errorService.onError(error));
  }

  isRequireGuidedTourImg() {
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
  }

  tourGuideGotIt() {
    this.guidedTourStatus = this.guidedTourService.updateTourStatus(ImagePath.CANDIDATE_VALUE_PORTRAIT_VIEW, true);
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
    this.guidedTourService.updateProfileField(this.guidedTourStatus)
      .subscribe(
        (res: any) => {
          LocalStorageService.setLocalValue(LocalStorage.GUIDED_TOUR, JSON.stringify(res.data.guide_tour));
        },
        error => this.errorService.onError(error)
      );
  }

  updateCapabilityData(candidate: Candidate) {
    for (var i = candidate.capabilities.length - 1; i >= 0; i--) {
      if (candidate.capabilities.length > 0) {
        for (let i = candidate.capabilities.length - 1; i >= 0; i--) {
          for (let j = candidate.capabilities[i].complexities.length - 1; j >= 0; j--) {
            if (candidate.capabilities[i].complexities[j].answer != undefined) {
              candidate.capabilities[i].isComplexityAnswerComplete = true;
            } else {
              candidate.capabilities[i].isComplexityAnswerComplete = false;
            }
          }
        }
        return candidate;
      }
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

  getLabel() {
    return Label;
  }

}
