import {Component, Input, OnChanges} from '@angular/core';
import {CandidateDetail} from '../../../../../framework/registration/candidate/candidate';
import {Candidate} from '../../../model/candidate';
import {CandidateProfileService} from '../../../candidate-profile/candidate-profile.service';
import {ComplexityComponentService} from '../../../complexities/complexity.service';
import {JobCompareService} from '../../../single-page-compare-view/job-compare-view/job-compare-view.service';
import {ErrorService} from "../../../error.service";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-view',
  templateUrl: 'candidate-view.component.html',
  styleUrls: ['candidate-view.component.css'],

})

export class CandidateViewComponent implements OnChanges{
  @Input() candidateId: string;
  private candidateDetails: CandidateDetail = new CandidateDetail();
  private candidate: Candidate = new Candidate();
  private secondaryCapabilities: string[] = new Array();
  private capabilities : any;
  constructor(private profileCreatorService: CandidateProfileService,
              private errorService:ErrorService,
              private complexityComponentService: ComplexityComponentService,
              private jobCompareService : JobCompareService) {
  }

  ngOnChanges(changes: any) {
    if (changes.candidateId != undefined && changes.candidateId.currentValue != undefined) {
      this.candidateId = changes.candidateId.currentValue;
      this.getCandidateProfile(this.candidateId);
      this.complexityComponentService.getCapabilityMatrix(undefined).subscribe(
        capa => {
          this.capabilities= this.jobCompareService.getStandardMatrix(capa.data);
        },error => this.errorService.onError(error));
    }
  }

  getCandidateProfile(candidateId: string) {
    this.profileCreatorService.getCandidateDetailsOfParticularId(candidateId)
      .subscribe(
        candidateData => this.OnCandidateDataSuccess(candidateData),
        error => this.errorService.onError(error));
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
