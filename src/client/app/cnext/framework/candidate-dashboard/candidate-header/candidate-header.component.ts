import {Component,Input,EventEmitter,Output} from "@angular/core";
import {Router} from "@angular/router";
import {Candidate} from "../../model/candidate";
import {NavigationRoutes} from "../../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-header',
  templateUrl: 'candidate-header.component.html',
  styleUrls: ['candidate-header.component.css'],
})

export class CandidateHeaderComponent  {
  @Input() candidate:Candidate;
@Output() onLinkClick=new EventEmitter();
  constructor(private _router:Router) {

  }

  onApplyClick(){
  this.onLinkClick.emit('apply');
  }

  onBlockClick(){
    this.onLinkClick.emit('block');
}
  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}
