import {Component,  Input} from "@angular/core";
import {JobSummary} from "../../../model/jobSummary";
import {ImagePath} from "../../../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-job-information',
  templateUrl: 'recruiter-job-information.component.html',
  styleUrls: ['recruiter-job-information.component.css']
})

export class RecruiterJobInformation  {
  @Input() recruiter: JobSummary=new JobSummary() ;
  private image_path:string=ImagePath.COMPANY_LOGO_IMG_ICON;

  ngOnChanges(changes:any) {
    if(changes.recruiter.currentValue != undefined){
      this.recruiter=changes.recruiter.currentValue;
    }
    if(this.recruiter != undefined && this.recruiter.company_logo != undefined){
      this.image_path=this.recruiter.company_logo;
    }
  }
}
