import {Component, Input} from "@angular/core";

import {CandidateDetail} from "../../../../../framework/registration/candidate/candidate";
import {Candidate} from "../../../model/candidate";
import {AppSettings, ImagePath} from "../../../../../shared/constants";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-description',
  templateUrl: 'candidate-basic-information.component.html',
  styleUrls: ['candidate-basic-information.component.css']
})

export class CandidateBasicInformationComponent {

  @Input() candidateDetails: CandidateDetail = new CandidateDetail();
  @Input() candidate: Candidate = new Candidate();

  private image_path: string = ImagePath.PROFILE_IMG_ICON;
  ngOnChanges() {
    if (this.candidateDetails !== undefined) {
      if (this.candidateDetails.picture !== undefined) {
        this.image_path = AppSettings.IP + this.candidateDetails.picture.substring(4).replace('"', '');
      }
    }
  }

  getImagePath(imagePath: string) {
    if (imagePath != undefined) {
      return AppSettings.IP + imagePath.substring(4).replace('"', '');
    }
    return null;
  }
}
