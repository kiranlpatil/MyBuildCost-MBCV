import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {Industry} from "../model/industry";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Section} from "../model/candidate";

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

  private industries: Industry[] = new Array(0);
  private choosedIndustry: Industry = new Industry();
  private isValid:boolean = true;
  constructor(private candidateProfileService: CandidateProfileService) {
    this.candidateProfileService.getIndustries()
      .subscribe(industries => this.industries = industries.data);
  }

  ngOnChanges(changes: any) {
    if (changes.selectedIndustry !== undefined && changes.selectedIndustry.currentValue !== undefined) {
      this.selectedIndustry = changes.selectedIndustry.currentValue;
      this.choosedIndustry = this.selectedIndustry;
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
    this.valueChange.emit(this.choosedIndustry);
    this.highlightedSection.name = 'Work-Area';
    this.highlightedSection.isDisable = false;
  }
}


