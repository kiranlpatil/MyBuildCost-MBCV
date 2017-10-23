import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { JobPosterService } from '../job-poster/job-poster.service';
import { MessageService } from '../../../shared/services/message.service';
import { Message } from '../../../shared/models/message';
import { Headings, Label, Button, Messages } from '../../../shared/constants';
import { ErrorService } from '../../../shared/services/error.service';
import { JobCloseComponentService } from './job-close.component.service';

@Component ({

  moduleId: module.id,
  selector: 'cn-job-close',
  templateUrl: 'job-close.component.html',
  styleUrls: ['job-close.component.css']
})

export class JobCloseComponent implements OnChanges, OnInit {

  @Input() selectedJobTitleForClose: string;
  @Input() selectedJobProfile: any;
  @Input() isJobCloseButtonClicked:boolean;


  private showCloseDialogue:boolean = false;
  private selectedJobCloseReason: number;
  reasonForClosingJob: any = new Array(0);
  private isShowNoSelectionError: boolean = false;

  constructor(private errorService: ErrorService, private jobPosterService: JobPosterService,
              private messageService: MessageService, private jobCloseComponentService: JobCloseComponentService) {
  }

  ngOnInit() {
    this.jobCloseComponentService.getReasonsForClosingJob()
      .subscribe(data => {
        this.reasonForClosingJob = data.questions;
      }, error=> {
        this.errorService.onError(error);
      });
  }

  ngOnChanges(changes:any) {
    if(changes.isJobCloseButtonClicked !== undefined && changes.isJobCloseButtonClicked.currentValue !== undefined) {
      this.showCloseDialogue = true;
    }
  }


  onCloseJob() {
    if(this.selectedJobCloseReason === undefined || this.selectedJobCloseReason === null) {
      this.isShowNoSelectionError = true;
      return;
    } else {
      this.showCloseDialogue = false;
      this.selectedJobProfile.isJobPostClosed = true;
      this.selectedJobProfile.jobCloseReason = this.selectedJobCloseReason;
      this.jobPosterService.postJob(this.selectedJobProfile).subscribe(
        data => {
          this.selectedJobProfile = data.data.postedJobs[0];
        }, error => this.errorService.onError(error));
      this.messageService.message(new Message(this.selectedJobTitleForClose+ " Job Post is closed"));
    }
  }

  setStyleForDialogueBox() {
    if (this.showCloseDialogue) {
      return 'block';
    } else {
      return 'none';
    }
  }

  onCancel() {
    this.showCloseDialogue = false;
  }

  getHeading() {
    return Headings;
  }

    getMessages() {
        return Messages;
    }

  getLabel() {
    return Label;
  }

  getButtonLabel() {
    return Button;
  }

  onJobCloseReason(selectedReason: string) {
    this.selectedJobCloseReason = this.reasonForClosingJob[0].answers.indexOf(selectedReason);
  }
}
