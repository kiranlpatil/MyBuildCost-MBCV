import {Component,  Input} from "@angular/core";
import {JobSummary} from "../../../model/jobSummary";
import {ImagePath, AppSettings} from "../../../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-job-information',
  templateUrl: 'recruiter-job-information.component.html',
  styleUrls: ['recruiter-job-information.component.css']
})

export class RecruiterJobInformation  {
  @Input() recruiter: JobSummary=new JobSummary() ;
  private image_path:string=ImagePath.PROFILE_IMG_ICON;

  ngOnChanges(changes:any) {
    if(changes.recruiter.currentValue != undefined){
      this.recruiter=changes.recruiter.currentValue;
    }
    if(this.recruiter != undefined && this.recruiter.company_logo != undefined){
      this.image_path= AppSettings.IP + this.recruiter.company_logo .substring(4).replace('"', '');;
    }
  }
}
