import {Component, Input, OnChanges } from '@angular/core';
import {CandidateQCard} from "../model/candidateQcard";
import {Router} from '@angular/router';
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Button, ValueConstant, UsageActions, LocalStorage} from "../../../shared/constants";
import {Message} from "../../../shared/models/message";
import {MessageService} from "../../../shared/services/message.service";
import {ActionOnQCardService} from "../../../user/services/action-on-q-card.service";
import {UsageTracking} from "../model/usage-tracking";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {UsageTrackingService} from "../usage-tracking.service";
import {ErrorService} from "../../../shared/services/error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-action',
  templateUrl: 'recruiter-action.component.html',
  styleUrls: ['recruiter-action.component.css']
})

export class RecruiterAction implements OnChanges {

  @Input() candidate: any;
  @Input() jobId: string;
  @Input() type: string;
  @Input() isValuePortraitView: boolean;
  @Input() isOverlayView: boolean;

  constructor(private _router:Router,private profileCreatorService: CandidateProfileService,
              private messageService: MessageService,
              private actionOnQCardService: ActionOnQCardService,
              private usageTrackingService : UsageTrackingService,
              private errorService: ErrorService) {

  }

  ngOnChanges(changes:any) {
    if(changes.candidate !== undefined && changes.candidate.currentValue !== undefined) {
      this.candidate = changes.candidate.currentValue;
    }
    if(changes.jobId !== undefined && changes.jobId.currentValue !== undefined) {
      this.jobId = changes.jobId.currentValue;
    }
    if(changes.type !== undefined && changes.type.currentValue !== undefined) {
      this.type = changes.type.currentValue;
    }
    if(changes.isOverlayView !== undefined && changes.isOverlayView.currentValue !== undefined) {
      this.isOverlayView = changes.isOverlayView.currentValue;
    }
    if(changes.isValuePortraitView !== undefined && changes.isValuePortraitView.currentValue !== undefined) {
      this.isValuePortraitView = changes.isValuePortraitView.currentValue;
    }
  }

  viewProfile(candidate: CandidateQCard) {
    this.actionOnQCardService.setActionOnViewProfile(candidate);
  }

  addForCompareView(value: any,sorceName:string) {
    var obj= {'id':value._id,'sorceName':sorceName};
    this.actionOnQCardService.setValueForCompareView(obj);
    var message = new Message();
    message.isError = false;
    message.custom_message = 'Candidate' + ' ' + value.first_name + ' ' + value.last_name + ' added to compare view.';
    this.messageService.message(message);
  }

  navigateWithId(nav: string, candidate: CandidateQCard) {
    this.profileCreatorService.getCandidateDetailsOfParticularId(candidate._id).subscribe(
      candidateData => {
        this._router.navigate([nav, candidateData.data.userId,{jobId: this.jobId, type: this.type}]);
      });
  }

  navigateToApplicantSearch(nav: string, candidate: any) {
    let usageTrackingData: UsageTracking = new UsageTracking();
    usageTrackingData.recruiterId = LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
    usageTrackingData.jobProfileId = this.jobId;
    usageTrackingData.candidateId = this.candidate._id;
    usageTrackingData.action = UsageActions.MATCHED_CANDIDATE_AGAINST_ALL_JOB_BY_RECRUITER;
    this.usageTrackingService.addUsesTrackingData(usageTrackingData).subscribe(
      err => {
        this.errorService.onError(err);
      }
    );
    if(!this.isValuePortraitView) {
      this._router.navigate([nav, candidate._id]);
    }else {
      this._router.navigate([nav, candidate.candidateId]);
    }
  }

  getButtons() {
    return Button;
  }

  actionToBePerformed(action:string, destination:string, item: any) {
    let data = {'action': action, 'destination': destination, 'id': item};
    this.actionOnQCardService.actionToBePerformed(data);
  }
}
