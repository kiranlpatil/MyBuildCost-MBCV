import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { JobPosterService } from '../job-poster/job-poster.service';
import { Button, Headings, Label } from '../../../shared/constants';
import { Message } from '../../../shared/models/message';
import { MessageService } from '../../../shared/services/message.service';


@Component({
  moduleId: module.id,
  selector: 'cn-job-clone',
  templateUrl: 'job-clone.component.html',
  styleUrls: ['job-clone.component.css']
})
export class JobCloneComponent implements OnChanges {
  @Input() selectedJobId:string;
  @Input() selectedJobTitle:string;
  @Input() isCloneButtonClicked:boolean;
  @Output() raiseJobEditViewEventEmitter:EventEmitter<string> = new EventEmitter();

  private showCloneDialogue:boolean = false;
  isShowEmptyTitleError:boolean=false;


  constructor(private jobPosterService:JobPosterService, private messageService: MessageService) {}

  ngOnChanges(changes:any) {
    if (changes.selectedJobId!== undefined
      && changes.selectedJobId.currentValue !== undefined) {
      this.showCloneDialogue=true;
    }
    if(changes.isCloneButtonClicked !== undefined && changes.isCloneButtonClicked.currentValue !== undefined) {
      this.showCloneDialogue = true;
    }
  }

  setStyleForDialogueBox() {
    if (this.showCloneDialogue) {
      return 'block';
    } else {
      return 'none';
    }
  }

  onClone() {
    if(this.selectedJobTitle.length>0) {
      this.isShowEmptyTitleError=false;
      this.jobPosterService.cloneJob(this.selectedJobId, this.selectedJobTitle).subscribe(
        data => {
          this.raiseJobEditViewEventEmitter.emit(data.data);
        },error => this.onCloneFail(error));
      this.showCloneDialogue = false;
    }else {
      this.isShowEmptyTitleError=true;
    }

  }
  onCancel() {
    this.showCloneDialogue = false;


  }
  onCloneFail(error: any) {
    if (error.err_code === 403 || error.err_code === 0) {
      var message = new Message();
      message.error_msg =error.err_msg ;
      message.isError = true;
      this.messageService.message(message);
    }
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
