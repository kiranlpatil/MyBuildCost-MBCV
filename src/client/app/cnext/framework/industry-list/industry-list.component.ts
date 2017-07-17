import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {Industry} from "../model/industry";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Section} from "../model/candidate";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage, Messages} from "../../../framework/shared/constants";

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

  tooltipMessage: string =
      '<ul>' +
      '<li><p>1. Enter your industry. This industry forms the core of your current professional profile. In next sections, you shall be shown questions and parameters that are relevant to this industry.</p></li><li><p>2. If you have worked in multiple industries, choose the one that is most relevent as on date. You shall get option to include additional industries in later section.</p></li>' +
      '</ul>';

  private industries: Industry[] = new Array(0);
  private choosedIndustry: Industry = new Industry();
  private isValid:boolean = true;
  private requiredFieldMessage = Messages.MSG_ERROR_VALIDATION_INDUSTRY_REQUIRED;
  constructor(private candidateProfileService: CandidateProfileService) {
    this.candidateProfileService.getIndustries()
      .subscribe(industries => this.industries = industries.data);
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
    if(this.choosedIndustry.name == ''){
      this.isValid = false;
      return;
    }
    if (this.choosedIndustry.name === this.selectedIndustry.name) {

    }
    else {
      this.valueChange.emit(this.choosedIndustry);
    }
    this.highlightedSection.name = 'Work-Area';
    this.highlightedSection.isDisable = false;
  }

  onPrevious() {
    if (this.choosedIndustry.name !== this.selectedIndustry.name) {
      this.choosedIndustry = Object.assign(this.selectedIndustry);
    }
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.highlightedSection.name = 'Profile';
    } else {
      this.highlightedSection.name = 'JobProfile';
    }
  }
}


