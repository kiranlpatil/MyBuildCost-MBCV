import {Component,Input,EventEmitter,Output} from "@angular/core";
import {JobQcard} from "../../model/JobQcard";
import {LocalStorage} from "../../../../framework/shared/constants";
import {LocalStorageService} from "../../../../framework/shared/localstorage.service";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-job-list',
  templateUrl: 'candidate-job-list.component.html',
  styleUrls: ['candidate-job-list.component.css'],
})
export class CandidateJobListComponent  {
  @Input() listOfJobs:JobQcard[];
  @Input() type:string;
  @Output() onAction=new EventEmitter();


  onActionPerform(action:string){
    this.onAction.emit(action);
  }
}
