import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import {Industry} from "../../../user/models/industry";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Section} from "../../../user/models/candidate";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {Headings, LocalStorage, Messages, Tooltip, ValueConstant} from "../../../shared/constants";
import {IndustryDataService} from "../industry-data-service";
import {ErrorService} from "../../../shared/services/error.service";
import {Router} from "@angular/router";
import {ComplexityAnsweredService} from "../complexity-answered.service";

@Component({
  moduleId: module.id,
  selector: 'cn-industry-experience',
  templateUrl: 'industry-experience.component.html',
  styleUrls: ['industry-experience.component.css']
})

export class IndustryExperienceListComponent implements OnInit,OnChanges {
  @Input() highlightedSection: Section;
  @Input() choosedIndustry: string;
  @Input() candidateExperiencedIndustry: string[] = new Array(0);
  @Output() onComplete = new EventEmitter();
  @Output() onNextComplete = new EventEmitter();
  tooltipCandidateMessage: string = '<ul><li>' +
    '<p>1. '+ Tooltip.INDUSTRY_EXPERIENCE_CANDIDATE_TOOLTIP_1+'</p></li>' +
  '<li><p>2. '+Tooltip.INDUSTRY_EXPERIENCE_CANDIDATE_TOOLTIP_2+'</p></li></ul>';

  tooltipRecruiterMessage: string = '<ul><li>' +
    '<p>1. '+ Tooltip.INDUSTRY_EXPERIENCE_RECRUITER_TOOLTIP+'</p></li>' +
  '</ul>';
  additinaolDomainHeading:string= Headings.ADDITIONAL_DOMAIN_EXPOSURE;
  private showButton: boolean = true;
  private industries: Industry[] = new Array(0);
  private selectedIndustries: string[] = new Array(0);
  private disableButton: boolean = true;
  private isCandidate:boolean = false;
  private submitStatus: boolean;
  private requiedIndustryExposureValidationMessage = Messages.MSG_ERROR_VALIDATION_INDUSTRY_EXPOSURE_REQUIRED;
  private suggestionMessageAboutDomain:string;
  private suggestionMessageAboutCandidateDomain:string;
  userId : string;

  constructor(private candidateProfileService: CandidateProfileService,
              private errorService:ErrorService,
              private industryDetailsService: IndustryDataService,
              private _router: Router, private complexityAnsweredService: ComplexityAnsweredService) {
    this.industryDetailsService.makeCall$.subscribe(
      data => {
        if (data && this.industries.length === 0) {
          this.getIndustries();
        }
      });
    this.candidateExperiencedIndustry = new Array(0);
  }
  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
    this.userId=LocalStorageService.getLocalValue(LocalStorage.USER_ID);
  }
  ngOnChanges(changes: any) {

    if (changes.candidateExperiencedIndustry !== undefined && changes.candidateExperiencedIndustry.currentValue !== undefined) {
      this.candidateExperiencedIndustry = changes.candidateExperiencedIndustry.currentValue;
      this.selectedIndustries = this.candidateExperiencedIndustry;
      if (this.selectedIndustries.length > 0) {
        this.disableButton = false;
      }
    }

    if (changes.choosedIndustry !== undefined && changes.choosedIndustry.currentValue !== undefined) {
      this.choosedIndustry = changes.choosedIndustry.currentValue;
        this.suggestionMessageAboutDomain = 'In addition to ' + this.choosedIndustry + ' industry, do you want the candidate to have mandatory experience in any specific domain? If yes, select such must have domains from below.';
        this.suggestionMessageAboutCandidateDomain = 'In addition to ' + this.choosedIndustry + ' industry, do you have exposure to any of the domains mentioned below? If yes, select relevant domains.';
    }
    if (this.candidateExperiencedIndustry === undefined) {
      this.candidateExperiencedIndustry = new Array(0);
    }
  }

  selectIndustryModel(industry: string, event: any) {
    if (event.target.checked) {
      this.submitStatus = false;
    if(this.candidateExperiencedIndustry.indexOf('None')!=-1){
      this.candidateExperiencedIndustry.splice(this.candidateExperiencedIndustry.indexOf('None'));
    }
      this.disableButton = false;
      if (this.selectedIndustries.length < ValueConstant.MAX_INTERESTEDINDUSTRY) {
        this.selectedIndustries.push(industry);
      } else {
        event.target.checked = false;
      }
      if(industry==='None'){
        this.selectedIndustries=new Array(0);
        this.selectedIndustries.push(industry);
      }
    } else {
      for (let data of this.selectedIndustries) {
        if (data === industry) {
          this.selectedIndustries.splice(this.selectedIndustries.indexOf(data), 1);
        }
      }
    }
    if (this.selectedIndustries.length <= 0) {
      this.disableButton = true;
    }
    this.onComplete.emit(this.selectedIndustries);
  }

  onNext() {
    if(this.selectedIndustries.length==0) {
      this.submitStatus = true;
      return;
    }
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.onNextComplete.emit();
      this.complexityAnsweredService.change(true);
      this.highlightedSection.name = 'Professional-Details';
      this.highlightedSection.isDisable = false;
    } else {
      this.onNextComplete.emit();
      this.highlightedSection.name = 'ReleventIndustry';
      this.highlightedSection.isDisable = false;
      this.onNextComplete.emit();

    }
      window.scrollTo(0, 0);
  }

  onSave() {
    if(this.selectedIndustries.length==0) {
      this.submitStatus = true;
      return;
    }
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
      window.scrollTo(0, 0);
  }

  getIndustries() {
    this.candidateProfileService.getIndustries()
      .subscribe(industries => this.onIndustryListSuccess(industries.data),
        error => this.errorService.onError(error));
  }

  onIndustryListSuccess(data: Industry[]) {
    this.industries = data;
    for (let item of this.industries) {
      if (item.name === this.choosedIndustry) {
        this.industries.splice(this.industries.indexOf(item), 1);
      }
    }
    var newIndustry = new Industry();
    newIndustry.name = 'None';
    this.industries.unshift(newIndustry);
    if(this.candidateExperiencedIndustry.length==0) {
      this.candidateExperiencedIndustry.push(newIndustry.name);
    }
  }

    onPrevious() {
        this.highlightedSection.name = 'Proficiencies';
        window.scrollTo(0, 0);
    }

    onEdit() {
        this.highlightedSection.name = 'IndustryExposure';
        this.disableButton = false;
        this.highlightedSection.isDisable = true;
        this.showButton = false;
        window.scrollTo(0, 0);
    }

  navigateToWithId(nav:string) {
    var userId = LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    if (nav !== undefined) {
      let x = nav+'/'+ userId + '/create';
      // this._router.navigate([nav, userId]);
      this._router.navigate([x]);
    }
  }


  getMessage() {
    return Messages;
  }

}

