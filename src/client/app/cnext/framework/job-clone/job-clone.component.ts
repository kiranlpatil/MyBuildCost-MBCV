import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {JobPosterService} from "../job-poster/job-poster.service";
import {Button, Headings, Label} from "../../../shared/constants";
import {ValidationService} from "../../../shared/customvalidations/validation.service";


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
  private isShowEmptyTitleError:boolean=false;


  constructor(private jobPosterService:JobPosterService) {}

  ngOnChanges(changes:any) {
    if (changes.selectedJobId!== undefined
      && changes.selectedJobId.currentValue !== undefined){
      this.showCloneDialogue=true;
    }
    if(changes.isCloneButtonClicked.currentValue!==undefined) {
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
        });
      this.showCloneDialogue = false;
    }else{
      this.isShowEmptyTitleError=true;
    }

  }
  onCancel() {
    this.showCloneDialogue = false;


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
