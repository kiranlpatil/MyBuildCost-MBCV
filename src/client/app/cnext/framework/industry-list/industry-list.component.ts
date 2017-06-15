import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Industry } from '../model/industry';
import { CandidateProfileService } from '../candidate-profile/candidate-profile.service';

@Component({
  moduleId: module.id,
  selector: 'cn-industry-list',
  templateUrl: 'industry-list.component.html',
  styleUrls: ['industry-list.component.css']
})

export class IndustryListComponent {
  @Input() selectedIndustry: Industry = new Industry();
  @Output() valueChange = new EventEmitter();

  private industries: Industry[] = new Array(0);

  constructor(private candidateProfileService: CandidateProfileService) {
    this.candidateProfileService.getIndustries()
      .subscribe(industries => this.industries = industries.data);
  }

  onValueChange(industry: Industry) {
    industry.roles = new Array(0);
    this.valueChange.emit(industry);
  }
}


