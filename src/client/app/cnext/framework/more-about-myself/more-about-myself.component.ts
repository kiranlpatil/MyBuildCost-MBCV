import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {MessageService} from "../../../shared/services/message.service";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Message} from "../../../shared/models/message";
import {Candidate, Section} from "../../../user/models/candidate";
import {
  Headings, ImagePath, LocalStorage, Messages, Tooltip,
  CandidateProfileUpdateTrack
} from "../../../shared/constants";
import {GuidedTourService} from "../guided-tour.service";
import {ErrorService} from "../../../shared/services/error.service";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {ComplexityAnsweredService} from "../complexity-answered.service";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'cn-more-about-myself',
  templateUrl: 'more-about-myself.component.html',
  styleUrls: ['more-about-myself.component.css']
})

export class MoreAboutMyselfComponent implements OnInit {
  @Input() candidate: Candidate;
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();
  gotItMessage:string= Headings.GOT_IT;
  aboutMyselfHeading:string= Headings.ABOUT_MYSELF;
  optinalfield:string= Headings.OPTIONAL;
  private maxLength: number = 250;
  private reSize: string[];
  private spaceSplitedString: string[];
  private dotSplitedString: string[];
  private commaSplitedString: string[];
  private wordsTillNow: number;
  private remainingWords: number;
  private maxword: number;
  private showButton: boolean = true;
  tooltipMessage: string = '<ul><li><p>1. '+ Tooltip.MORE_ABOUT_MYSELF_TOOLTIP+'</p></li></ul>';
  private remainingWordsMessage = Messages.MSG_ERROR_VALIDATION_MAX_WORD_ALLOWED;

  guidedTourStatus:string[] = new Array(0);
  guidedTourImgOverlayScreensEmploymentHistory:string;
  private guidedTourImgOverlayScreensEmploymentHistoryPath:string;
  isGuideImg:boolean = false;
  private isCandidate: boolean;
  private userId: string;

  constructor(private messageService: MessageService,private errorService:ErrorService,
              private profileCreatorService: CandidateProfileService,private guidedTourService:GuidedTourService,
              private complexityAnsweredService: ComplexityAnsweredService,
              private _router: Router) {
    this.reSize = new Array(1);
  }

  ngOnInit() {
    if(Number(window.innerWidth) <= 768) {
      this.guidedTourService.updateTourStatus(ImagePath.CANDIDATE_OERLAY_SCREENS_EMPLOYMENT_HISTORY,true);
    }
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
      this.userId=LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    }
  }

  ngOnChanges(changes: any) {
    if (this.candidate.aboutMyself !== undefined) {
      this.spaceSplitedString = this.candidate.aboutMyself.split(' ');
      this.dotSplitedString = this.candidate.aboutMyself.split('.');
      this.commaSplitedString = this.candidate.aboutMyself.split(',');
      this.wordsTillNow = this.spaceSplitedString.length + this.dotSplitedString.length + this.commaSplitedString.length;
      this.remainingWords = this.maxLength - (this.wordsTillNow - 3);
    }
    if (this.candidate.aboutMyself == undefined) {
      this.candidate.aboutMyself = '';
    }
  }

  OnCandidateDataSuccess(candidateData: any) {
  }

  onError(error: any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  addAboutMyself() {
    this.spaceSplitedString = this.candidate.aboutMyself.split(' ');
    this.dotSplitedString = this.candidate.aboutMyself.split('.');
    this.commaSplitedString = this.candidate.aboutMyself.split(',');
    this.wordsTillNow = this.spaceSplitedString.length + this.dotSplitedString.length + this.commaSplitedString.length;
    this.remainingWords = this.maxLength - (this.wordsTillNow - 3);
    if (this.wordsTillNow - 3 >= this.maxLength) {
      this.maxword = this.candidate.aboutMyself.length;
    }
    if(this.candidate.profile_update_tracking < CandidateProfileUpdateTrack.STEP_IS_ENTER_ABOUT_MYSELF) {
      this.candidate.profile_update_tracking = CandidateProfileUpdateTrack.STEP_IS_ENTER_ABOUT_MYSELF;
    }
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        this.highlightedSection.isDisable = false;
      },error => this.errorService.onError(error));
    this.onComplete.emit(this.candidate.aboutMyself);
  }
  onNext() {
    this.profileCreatorService.updateStepTracking(CandidateProfileUpdateTrack.STEP_IS_ENTER_ABOUT_MYSELF);
    this.isGuidedTourImgRequire();
    this.complexityAnsweredService.change(true);
  }

  isGuidedTourImgRequire() {
    this.isGuideImg = true;
    this.guidedTourImgOverlayScreensEmploymentHistory = ImagePath.CANDIDATE_OERLAY_SCREENS_EMPLOYMENT_HISTORY;
    this.guidedTourImgOverlayScreensEmploymentHistoryPath = ImagePath.BASE_ASSETS_PATH_DESKTOP + ImagePath.CANDIDATE_OERLAY_SCREENS_EMPLOYMENT_HISTORY;
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
    if(this.guidedTourStatus.indexOf(this.guidedTourImgOverlayScreensEmploymentHistory) !== -1) {
     this.onNextAction();
    }
  }

  onNextAction() {
    this.highlightedSection.name='EmploymentHistory';
    this.highlightedSection.isDisable=false;
    this.onComplete.emit(this.candidate.aboutMyself);
    this.complexityAnsweredService.change(true);
    window.scrollTo(0, 0);
  }

  onGotItGuideTour() {
    this.guidedTourStatus = this.guidedTourService.updateTourStatus(ImagePath.CANDIDATE_OERLAY_SCREENS_EMPLOYMENT_HISTORY,true);
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
    this.guidedTourService.updateProfileField(this.guidedTourStatus)
      .subscribe(
        (res:any) => {
          LocalStorageService.setLocalValue(LocalStorage.GUIDED_TOUR, JSON.stringify(res.data.guide_tour));
          this.isGuidedTourImgRequire()
        },
        error => this.errorService.onError(error)
      );

  }

  onSave() {
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    window.scrollTo(0, 0);
  }

  onPrevious() {
    this.highlightedSection.name = 'Professional-Details';
    window.scrollTo(0, 0);
  }

  onEdit() {
    this.highlightedSection.name = 'AboutMySelf';
    this.highlightedSection.isDisable = true;
    this.showButton = false;
    window.scrollTo(0, 0);
  }

  getMessage() {
    return Messages;
  }

  navigateToWithId(nav:string) {
    var userId = LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    if (nav !== undefined) {
      let x = nav+'/'+ userId + '/create';
      // this._router.navigate([nav, userId]);
      this._router.navigate([x]);
    }
  }
}
