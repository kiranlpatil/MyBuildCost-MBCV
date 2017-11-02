import {Component} from '@angular/core';
import {Candidate} from "../../../user/models/candidate";
import {ErrorService} from "../../../shared/services/error.service";
import {MessageService} from "../../../shared/services/message.service";
import {UserFeedbackComponentService} from "./user-feedback.component.service";

@Component({
  moduleId: module.id,
  selector: 'cn-user-feedback',
  templateUrl: 'user-feedback.component.html',
  styleUrls: ['user-feedback.component.css']
})

export class UserFeedbackComponent {
  candidate: Candidate = new Candidate();
  feedbackQuestions: any = new Array(0);

  constructor(private errorService: ErrorService, private messageService: MessageService,
              private userFeedbackComponentService: UserFeedbackComponentService) {
  }

  ngOnInit() {
    this.userFeedbackComponentService.getQuestionsForCandidateFeedback()
      .subscribe(data => {
        this.feedbackQuestions = data.feedbackQuestions;
        this.feedbackQuestions = Array.of(this.feedbackQuestions);
        console.log('feedbackQuestions ok1: ', this.feedbackQuestions);
      }, error => {
        this.errorService.onError(error);
      });
  }
}
