import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobQcard } from '../../model/JobQcard';

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-job-list',
  templateUrl: 'candidate-job-list.component.html',
  styleUrls: ['candidate-job-list.component.css'],
})
export class CandidateJobListComponent {
  @Input() listOfJobs: JobQcard[];
  @Input() type: string;
  @Output() onAction = new EventEmitter();


  onActionPerform(action: string) {
    this.onAction.emit(action);
  }
}
