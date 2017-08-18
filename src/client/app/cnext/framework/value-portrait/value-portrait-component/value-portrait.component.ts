import {Component, OnInit} from "@angular/core";
import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";
import {Candidate} from "../../model/candidate";
import {ErrorService} from "../../error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-value-portrait',
  templateUrl: 'value-portrait.component.html',
  styleUrls: ['value-portrait.component.css']
})

export class ValuePortraitComponent implements OnInit {

  private candidate: Candidate = new Candidate();

  constructor(private candidateProfileService: CandidateProfileService,private errorService:ErrorService) {

  }

  ngOnInit(): void {
    this.candidateProfileService.getCandidateAllDetails()
      .subscribe(
        candidateData => {
          this.candidate = candidateData.data;
        },error => this.errorService.onError(error));
  }

}
