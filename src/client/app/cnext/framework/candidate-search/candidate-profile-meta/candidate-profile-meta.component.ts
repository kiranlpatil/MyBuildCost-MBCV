import {Component, Input, OnChanges} from "@angular/core";
import {CandidateProfileMeta} from "../../model/candidate-profile-meta";
import {AppSettings} from "../../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-profile-meta',
  templateUrl: 'candidate-profile-meta.component.html',
  styleUrls: ['candidate-profile-meta.component.css']
})

export class CandidateProfileMetaComponent implements OnChanges {

  @Input() candidateMetaData:CandidateProfileMeta;
  imagePath:string;

  constructor() {
  }

  ngOnChanges(changes:any) {
    if (changes.candidateMetaData.currentValue != undefined) {
      if (this.candidateMetaData.userId.picture) {
        this.imagePath = AppSettings.IP + this.candidateMetaData.userId.picture.substring(4).replace('"', '');
      } else {
        this.imagePath = "assets/framework/images/dashboard/profile.png";
      }
    }
  }

}
