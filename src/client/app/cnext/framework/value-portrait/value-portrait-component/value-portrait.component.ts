import {Component, OnInit, Input} from "@angular/core";
import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";
import {Candidate} from "../../../../user/models/candidate";
import {ErrorService} from "../../error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-value-portrait',
  templateUrl: 'value-portrait.component.html',
  styleUrls: ['value-portrait.component.css']
})

export class ValuePortraitComponent implements OnInit {

  private candidate: Candidate = new Candidate();
  @Input() userId:string;
  @Input() isShareView:boolean;

  constructor(private candidateProfileService: CandidateProfileService,private errorService:ErrorService) {

  }

  ngOnInit(): void {
    this.candidateProfileService.getCandidateAllDetails(this.userId)
      .subscribe(
        candidateData => {
          this.candidate = this.updateCapabilityData(candidateData.data);
        },error => this.errorService.onError(error));
  }

  updateCapabilityData(candidate: Candidate) {
    for (var i = candidate.capabilities.length - 1; i >= 0; i--) {
      for (var j = candidate.capabilities[i].complexities.length - 1; j >= 0; j--) {
        if (candidate.capabilities[i].complexities[j].answer == undefined || candidate.capabilities[i].complexities[j].answer == 'Not Applicable') {
          candidate.capabilities[i].complexities.splice(j, 1);
        }
      }
      if (candidate.capabilities[i].complexities.length == 0) {
        candidate.capabilities.splice(i, 1);
      }
    }

    return candidate;
  }

}
