import {Component, Input, OnChanges} from '@angular/core';
import {JobPosterService} from "../job-poster/job-poster.service";
import {MessageService} from "../../../shared/services/message.service";
import {Message} from "../../../shared/models/message";
import {Headings, Label, Button} from "../../../shared/constants";
import {ErrorService} from "../../../shared/services/error.service";

@Component ({

  moduleId: module.id,
  selector: 'cn-job-close',
  templateUrl: 'job-close.component.html',
  styleUrls: ['job-close.component.scss']
})

export class JobCloseComponent implements OnChanges {

  @Input() selectedJobIdForClose: string;
  @Input() selectedJobTitleForClose: string;
  @Input() selectedJobProfile: any;
  @Input() isJobCloseButtonClicked:boolean;


  private showCloseDialogue:boolean = false;
  private isShowNoSelectionError: boolean = false;

  constructor(private errorService: ErrorService, private jobPosterService: JobPosterService, private messageService: MessageService) {
  }

  ngOnChanges(changes:any) {
    if (changes.selectedJobId!== undefined
      && changes.selectedJobId.currentValue !== undefined) {
      this.showCloseDialogue=true;
    }
    if(changes.isJobCloseButtonClicked.currentValue!==undefined) {
      this.showCloseDialogue = true;
    }
  }

  onCloseJob() { debugger  
    /*this.jobPosterService.closeJob(this.selectedJobId).subscribe(
      data => {
        console.log('close job component', data.isJobPostClosed);
      },error => this.onCloseFail(error));*/
    this.selectedJobProfile.isJobPostClosed = true;
    this.jobPosterService.postJob(this.selectedJobProfile).subscribe(
      data => {
        this.selectedJobProfile = data.data.postedJobs[0];
      }, error => this.errorService.onError(error))
  }

 /* onCloseFail(error: any) {
    if (error.err_code === 403 || error.err_code === 0) {
      var message = new Message();
      message.error_msg =error.err_msg ;
      message.isError = true;
      this.messageService.message(message);
    }
  }*/

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

  getLabel() {
    return Label;
  }

  getButtonLabel() {
    return Button;
  }

}