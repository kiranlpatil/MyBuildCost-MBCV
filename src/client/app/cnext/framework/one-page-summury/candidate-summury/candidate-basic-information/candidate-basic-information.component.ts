import {Component,Input } from "@angular/core";

import {CandidateDetail} from "../../../../../framework/registration/candidate/candidate";
import {Candidate} from "../../../model/candidate";
import {AppSettings} from "../../../../../framework/shared/constants";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-description',
  templateUrl: 'candidate-basic-information.component.html',
  styleUrls: ['candidate-basic-information.component.css']
})

export class CandidateBasicInformationComponent {
 
  @Input() candidateDetails:CandidateDetail=new CandidateDetail();
  @Input() candidate:Candidate=new Candidate();

  private image_path:string='assets/framework/images/dashboard/profile.png';
  
  ngOnChanges(){
    if(this.candidateDetails !== undefined){
      if(this.candidateDetails.picture !== undefined){
        this.image_path = AppSettings.IP + this.candidateDetails.picture.substring(4).replace('"', '');
      }
    }
  }
}
