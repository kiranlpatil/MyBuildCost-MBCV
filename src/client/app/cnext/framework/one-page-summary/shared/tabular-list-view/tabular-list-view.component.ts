import {Component, Input} from "@angular/core";
import {Role} from "../../../model/role";

@Component({
  moduleId: module.id,
  selector: 'cn-tabular-list-view',
  templateUrl: 'tabular-list-view.component.html',
  styleUrls: ['tabular-list-view.component.css']
})

export class TabularListViewComponent {

  @Input() roles: Role[] = new Array(0);
  /*@Input() button:RecruiterDashboardButton;
   @Input() model: Candidate;
   @Output() eventReject: EventEmitter<any>= new EventEmitter<any>();
   @Output() eventCart: EventEmitter<any>= new EventEmitter<any>();*/

  /*Reject(){

   this.eventReject.emit(this.model);
   this.model=new Candidate();
   }
   Addto(){
   this.eventCart.emit(this.model);
   this.model=new Candidate();
   }*/
}
