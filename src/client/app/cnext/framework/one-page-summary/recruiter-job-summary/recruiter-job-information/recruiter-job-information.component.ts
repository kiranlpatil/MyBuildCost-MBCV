import {Component, Input} from "@angular/core";
import {JobSummary} from "../../../model/jobSummary";
import {AppSettings, ImagePath} from "../../../../../shared/constants";
import {JobPosterModel} from "../../../../../user/models/jobPoster";
import {Recruiter} from "../../../../../user/models/recruiter";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-job-information',
  templateUrl: 'recruiter-job-information.component.html',
  styleUrls: ['recruiter-job-information.component.css']
})

export class RecruiterJobInformation {
  @Input() recruiter: Recruiter = new Recruiter(); // todo Get this API For recruiter information -- Abhijeet
  @Input() job: JobPosterModel = new JobPosterModel(); // todo integrate with @input -- Abhijeet
  private image_path: string = ImagePath.PROFILE_IMG_ICON;

  ngOnChanges(changes: any) {
    if (changes.recruiter && changes.recruiter.currentValue != undefined) {
      this.recruiter = changes.recruiter.currentValue;
    }
    if (this.recruiter != undefined && this.recruiter.company_logo != undefined) {
      this.image_path = AppSettings.IP + this.recruiter.company_logo;
    }
  }

  getImagePath(imagePath: string) {
    if (imagePath != undefined) {
      return AppSettings.IP + imagePath;
    }
    return null;
  }
}
