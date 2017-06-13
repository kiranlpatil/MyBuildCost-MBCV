import {Component, Input} from "@angular/core";
import {CandidateDetail} from "../../../../../framework/registration/candidate/candidate";
import {Candidate} from "../../../model/candidate";
import {CandidateProfileService} from "../../../candidate-profile/candidate-profile.service";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-view',
  templateUrl: 'candidate-view.component.html',
  styleUrls: ['candidate-view.component.css'],

})
export class CandidateViewComponent {
  @Input() candidateId: string;
  private candidateDetails: CandidateDetail = new CandidateDetail();
  private candidate: Candidate = new Candidate();
  private secondaryCapabilities: string[] = new Array();

  constructor(private profileCreatorService: CandidateProfileService) {
  }

  ngOnChanges(changes: any) {
    if (changes.candidateId != undefined && changes.candidateId.currentValue != undefined) {
      this.candidateId = changes.candidateId.currentValue;
      this.getCandidateProfile(this.candidateId);
    }
  }

  getCandidateProfile(candidateId: string) {
    this.profileCreatorService.getCandidateDetailsOfParticularId(candidateId)
      .subscribe(
        candidateData => this.OnCandidateDataSuccess(candidateData));
  }

  OnCandidateDataSuccess(candidateData: any) {
    this.candidate = candidateData.data;
    this.candidateDetails = candidateData.metadata;
    this.getSecondaryData();
  }

  getSecondaryData() {
    for (let role of this.candidate.industry.roles) {
      for (let capability of role.capabilities) {
        if (capability.isSecondary) {
          this.secondaryCapabilities.push(capability.name);
        }
      }
    }
  }
}
