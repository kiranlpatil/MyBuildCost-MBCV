import {Component,Input,EventEmitter,Output} from "@angular/core";
import {JobQcard} from "../../model/JobQcard";

@Component({
  moduleId: module.id,
  selector: 'cn-q-card-list',
  templateUrl: 'q-card-list.component.html',
  styleUrls: ['q-card-list.component.css'],

})
export class QcardListComponent  {
  @Input() listOfJobs:JobQcard[];
  @Input() type:string;
  @Output() onAction=new EventEmitter();

  onActionPerform(action:string){
    this.onAction.emit(action);
  }
}
