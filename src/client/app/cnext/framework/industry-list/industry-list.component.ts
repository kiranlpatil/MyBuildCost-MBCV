import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {Industry} from "../model/industry";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Section} from "../model/candidate";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage, Messages, Tooltip, Headings} from "../../../framework/shared/constants";
import {IndustryDetailsService} from "../industry-detail-service";
import {ErrorService} from "../error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-industry-list',
  templateUrl: 'industry-list.component.html',
  styleUrls: ['industry-list.component.css']
})

export class IndustryListComponent implements OnChanges {
  @Input() selectedIndustry: Industry = new Industry();
  @Input() highlightedSection: Section;
  @Output() valueChange = new EventEmitter();
  industryForCandidateHeading:string = Headings.INDUSTRY_FOR_CANDIDATE;
  industryForRecruiterHeading:string = Headings.INDUSTRY_FOR_RECRUITER;
  private isCandidate: boolean = false;
    private disableButton: boolean = true;
    private showButton: boolean = true;

  tooltipMessage: string =
      '<ul>' +
      '<li><p>1. '+Tooltip.INDUSTRY_LIST_TOOLTIP_1+'</p></li><li><p>2. '+Tooltip.INDUSTRY_LIST_TOOLTIP_2+'</p></li>' +
      '</ul>';

  private industries: Industry[] = new Array(0);
  private choosedIndustry: Industry = new Industry();
  private isValid:boolean = true;
  private requiredFieldMessage = Messages.MSG_ERROR_VALIDATION_INDUSTRY_REQUIRED;

  constructor(private candidateProfileService: CandidateProfileService,
              private errorService: ErrorService,
              private industryDetailsService: IndustryDetailsService) {
    this.industryDetailsService.makeCall$.subscribe(
      data => {
        if (data && this.industries.length === 0) {
          this.getIndustry();
        }
      }
    );
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
  }

  ngOnChanges(changes: any) {
    if (changes.selectedIndustry !== undefined && changes.selectedIndustry.currentValue !== undefined) {
      this.selectedIndustry = changes.selectedIndustry.currentValue;
      this.choosedIndustry = Object.assign(this.selectedIndustry);
    }
  }
  onValueChange(industry: Industry) {
    this.isValid = true;
    industry.roles = new Array(0);
    this.choosedIndustry = Object.assign(industry);
  }

  onNext() {
    if (this.choosedIndustry.code == '' || this.choosedIndustry.code == undefined) {
      this.isValid = false;
      return;
    }
    if (this.choosedIndustry.code === this.selectedIndustry.code) {

    } else {
      this.valueChange.emit(this.choosedIndustry);
    }
    this.highlightedSection.name = 'Work-Area';
    this.highlightedSection.isDisable = false;

      let _body: any = document.getElementsByTagName('BODY')[0];
      _body.scrollTop = -1;
  }

  onPrevious() {
    if (this.choosedIndustry.code !== this.selectedIndustry.code) {
      this.choosedIndustry = Object.assign(this.selectedIndustry);
    }
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.highlightedSection.name = 'Profile';
    } else {
      this.highlightedSection.name = 'JobProfile';
    }

      let _body: any = document.getElementsByTagName('BODY')[0];
      _body.scrollTop = -1;
  }

  getIndustry() {
    this.candidateProfileService.getIndustries()
      .subscribe(industries => this.industries = industries.data,
        error => this.errorService.onError(error));
  }

    onEdit() {
        this.highlightedSection.name = 'Industry';
        this.disableButton = false;
        this.showButton = false;
        this.highlightedSection.isDisable = true;
        let _body: any = document.getElementsByTagName('BODY')[0];
        _body.scrollTop = -1;
    }
}



