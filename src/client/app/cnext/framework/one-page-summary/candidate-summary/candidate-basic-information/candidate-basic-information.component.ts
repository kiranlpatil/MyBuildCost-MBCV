import {Component, Input} from "@angular/core";
import {CandidateDetail} from "../../../../../user/models/candidate-details";
import {Candidate} from "../../../../../user/models/candidate";
import {AppSettings, ImagePath, Label} from "../../../../../shared/constants";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-description',
  templateUrl: 'candidate-basic-information.component.html',
  styleUrls: ['candidate-basic-information.component.css']
})

export class CandidateBasicInformationComponent {

  @Input() candidateDetails: CandidateDetail = new CandidateDetail();
  @Input() candidate: Candidate = new Candidate();
  @Input() viewType:string;
  @Input() isShowCandidateDetails:boolean;

  private image_path: string = ImagePath.PROFILE_IMG_ICON;
  ngOnChanges() {
    if (this.candidateDetails !== undefined) {
      if (this.candidateDetails.picture !== undefined) {
        this.image_path = AppSettings.IP + this.candidateDetails.picture.replace('"', '');
      }
    }
  }

  getImagePath(imagePath: string) {
    if (imagePath != undefined) {
      return AppSettings.IP + imagePath.replace('"', '');
    }
    return null;
  }

  maskingToMobileNumber(mobile_number:number) {
    return mobile_number.toString()[0] + '*****' + mobile_number.toString().substr(mobile_number.toString().length - 4);
  }

  getLabel() {
    return Label;
  }
}
