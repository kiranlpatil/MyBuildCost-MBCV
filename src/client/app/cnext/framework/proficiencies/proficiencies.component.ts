import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Section} from "../../../user/models/candidate";
import {Headings, ImagePath, Label, LocalStorage, Messages, Tooltip, ValueConstant} from "../../../shared/constants";
import {ProficiencyDetailsService} from "../proficiency-detail-service";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {ErrorService} from "../../../shared/services/error.service";
import {GuidedTourService} from "../guided-tour.service";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {Router} from "@angular/router";
import {ComplexityAnsweredService} from "../complexity-answered.service";

@Component({
  moduleId: module.id,
  selector: 'cn-proficiencies',
  templateUrl: 'proficiencies.component.html',
  styleUrls: ['proficiencies.component.css']
})

export class ProficienciesComponent {
  @Input() choosedproficiencies: string[];
  @Input() highlightedSection: Section;
  @Input() isOthers: boolean;
  gotItMessage: string= Headings.GOT_IT;
  private proficiencies: string[];
  @Output() onComplete = new EventEmitter();
  @Output() onSelect = new EventEmitter();
  tooltipMessage: string = '<ul><li><p>' +
      '1. '+ Tooltip.PROFICIENCIES_TOOLTIP_1+'</p></li>' +
    '<li><p>2. '+ Tooltip.PROFICIENCIES_TOOLTIP_2+'</p></li>' +
    '<li><p>3. '+Tooltip.PROFICIENCIES_TOOLTIP_3+'</p></li></ul>';
  private maxProficiencies: number;
  guidedTourStatus: string[] = new Array(0);
  isGuideImg: boolean = false;
  guidedTourImgOverlayScreensKeySkills: string;
  private guidedTourImgOverlayScreensKeySkillsPath: string;
  isCandidate: boolean = false;
  userId: string;

  constructor(private proficiencyDetailService: ProficiencyDetailsService,
              private errorService:ErrorService,
              private guidedTourService: GuidedTourService,
              private profileCreatorService: CandidateProfileService,
              private _router: Router, private complexityAnsweredService: ComplexityAnsweredService) {
    this.proficiencyDetailService.makeCall$.subscribe(
      data => {
        if (data) {
          this.getProficiency();
        }
      }
    );
  }

  ngOnChanges(value: any) {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
    if (value && value.choosedproficiencies && value.choosedproficiencies.currentValue) {
      let guidedTourImages = LocalStorageService.getLocalValue(LocalStorage.GUIDED_TOUR);
      let newArray = JSON.parse(guidedTourImages);
      if (newArray && newArray.indexOf(ImagePath.CANDIDATE_OERLAY_SCREENS_KEY_SKILLS) == -1) {
        this.isGuidedTourImgRequire();
      }
    }
  }

  ngOnInit() {
    this.maxProficiencies = ValueConstant.MAX_PROFECIENCES;
    this.userId=LocalStorageService.getLocalValue(LocalStorage.USER_ID);
  }
  private showButton: boolean = true;
  private submitStatus: boolean;
  private requiredKeySkillsValidationMessage = Messages.MSG_ERROR_VALIDATION_KEYSKILLS_REQUIRED;
  private maxKeySkillsValidationMessage = Messages.MSG_ERROR_VALIDATION_MAX_SKILLS_CROSSED + ValueConstant.MAX_PROFECIENCES + Messages.MSG_ERROR_VALIDATION_MAX_PROFICIENCIES;

  onProficiencyComplete(proficiency: string[]) {
    this.onSelect.emit(proficiency);
    this.complexityAnsweredService.change(true);
  }

  isGuidedTourImgRequire() {
    this.isGuideImg = true;
    this.guidedTourImgOverlayScreensKeySkills = ImagePath.CANDIDATE_OERLAY_SCREENS_KEY_SKILLS;
    this.guidedTourImgOverlayScreensKeySkillsPath = ImagePath.BASE_ASSETS_PATH_DESKTOP + ImagePath.CANDIDATE_OERLAY_SCREENS_KEY_SKILLS;
  }

  onGotItGuideTour() {
    this.guidedTourStatus = this.guidedTourService.updateTourStatus(ImagePath.CANDIDATE_OERLAY_SCREENS_KEY_SKILLS, true);
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
    this.isGuideImg = false;
    this.guidedTourService.updateProfileField(this.guidedTourStatus)
      .subscribe(
        (res: any) => {
          LocalStorageService.setLocalValue(LocalStorage.GUIDED_TOUR, JSON.stringify(res.data.guide_tour));
        },
        error => this.errorService.onError(error)
      );
  }

  onNext() {
    this.onComplete.emit();
    this.complexityAnsweredService.change(true);
    this.highlightedSection.name = 'IndustryExposure';
    this.highlightedSection.isDisable = false;
    window.scrollTo(0, 0);
  }

  onSave() {
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.onComplete.emit();
    window.scrollTo(0, 0);
  }

  getProficiency() {
    this.profileCreatorService.getProficiency()
      .subscribe(
        data => {
          this.proficiencies = data.data[0].proficiencies;
        },error => this.errorService.onError(error));
  }

    onPrevious() {
        this.highlightedSection.name = 'Complexities';
      window.scrollTo(0, 0);
    }

    onEdit() {
        this.highlightedSection.name = 'Proficiencies';
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

  getLabel() {
    return Label;
  }
}
