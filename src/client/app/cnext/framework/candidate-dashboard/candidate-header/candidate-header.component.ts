import {Component,Input,EventEmitter,Output} from "@angular/core";
import {Router} from "@angular/router";
import {Candidate} from "../../model/candidate";
import {AppSettings, NavigationRoutes} from "../../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-header',
  templateUrl: 'candidate-header.component.html',
  styleUrls: ['candidate-header.component.css'],
})

export class CandidateHeaderComponent  {
  @Input() candidate:Candidate;

  constructor(private _router:Router) {
  }

  getImagePath(imagePath:string){
    if(imagePath != undefined){
      return AppSettings.IP + imagePath.substring(4).replace('"', '');
    }

    return null;
  }

  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}
