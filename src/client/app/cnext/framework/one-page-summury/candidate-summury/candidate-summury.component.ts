import {Component, OnInit} from "@angular/core";
import {ProfileCreatorService} from "../../profile-creator/profile-creator.service";
import {Message} from "../../../../framework/shared/message";
import {MessageService} from "../../../../framework/shared/message.service";
import {Candidate} from "../../model/candidate";
import {CandidateDetail} from "../../../../framework/registration/candidate/candidate";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-summury',
  templateUrl: 'candidate-summury.component.html',
  styleUrls: ['candidate-summury.component.css']
})

export class CandidateSummuryComponent implements OnInit {
private candidateDetails:CandidateDetail=new CandidateDetail();
private candidate:Candidate=new Candidate();

  constructor( private messageService:MessageService,
               private profileCreatorService:ProfileCreatorService) {
  }

  ngOnInit() {
    this.getCandidateProfile();
  }

  getCandidateProfile() {
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => this.OnCandidateDataSuccess(candidateData),
        error => this.onError(error));
  }

  OnCandidateDataSuccess(candidateData:any) {
    this.candidate = candidateData.data[0];
    this.candidateDetails = candidateData.metadata;
  }

  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }
}
