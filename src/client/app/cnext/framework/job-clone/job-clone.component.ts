import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {JobPosterService} from "../job-poster/job-poster.service";

@Component({
  moduleId: module.id,
  selector: 'cn-job-clone',
  templateUrl: 'job-clone.component.html',
  styleUrls: ['job-clone.component.css']
})
export class JobCloneComponent implements OnChanges {
  @Input() selectedJobId:string;
  @Input() selectedJobTitle:string;
  @Input() clone:boolean;
  @Output() jobEventEmitter:EventEmitter<any> = new EventEmitter();

  private showCloneDialogue:boolean = false;

  constructor(private jobPosterService:JobPosterService) {
  }

  ngOnChanges(changes:any) {
    if (changes.selectedJobId!== undefined
      && changes.selectedJobId.currentValue !== undefined){
      this.showCloneDialogue=true;
    }
    if(changes.clone.currentValue!==undefined) {
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
    this.jobPosterService.cloneJob(this.selectedJobId,this.selectedJobTitle).subscribe(
      data => {
        this.jobEventEmitter.emit(data.data);
      });
    this.showCloneDialogue = false;

  }

  onCancel() {
    this.showCloneDialogue = false;
  }
}
