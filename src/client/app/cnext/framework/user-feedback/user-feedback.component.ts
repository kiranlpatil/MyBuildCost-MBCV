import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {ErrorService} from "../../../shared/services/error.service";
import {MessageService} from "../../../shared/services/message.service";
import {UserFeedbackComponentService} from "./user-feedback.component.service";

@Component({
  moduleId: module.id,
  selector: 'cn-user-feedback',
  templateUrl: 'user-feedback.component.html',
  styleUrls: ['user-feedback.component.css']
})

export class UserFeedbackComponent implements OnInit, OnChanges {
  feedbackQuestions: string[] = new Array(0);
  @Input() currentFeedbackQuestion: number;
  @Output() onFeedbackAnswer:EventEmitter<number> = new EventEmitter<number>();
  isOpen: boolean = false;

  constructor(private errorService: ErrorService, private messageService: MessageService,
              private userFeedbackComponentService: UserFeedbackComponentService) {
  }

  ngOnInit() {
    this.userFeedbackComponentService.getFeedbackForCandidate()
      .subscribe(data => {
        this.feedbackQuestions = data.questions;
        console.log('feedbackQuestions: ', this.feedbackQuestions);
      }, error => {
        this.errorService.onError(error);
      });
  }

  ngOnChanges(changes: any) {
    if (changes.currentFeedbackQuestion && changes.currentFeedbackQuestion.currentValue) {
      this.currentFeedbackQuestion = changes.currentFeedbackQuestion.currentValue;
      this.isOpen = true;
    }
  }

  onSelect(answer: number) {
    this.onFeedbackAnswer.emit(answer);
    this.isOpen = false;
  }
}
