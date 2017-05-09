import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage, ImagePath, AppSettings, NavigationRoutes} from "../../../framework/shared/constants";
import {RecruiterDashboardService} from "./recruiter-dashboard.service";
import {JobPosterModel} from "../model/jobPoster";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard',
  templateUrl: 'recruiter-dashboard.component.html',
  styleUrls: ['recruiter-dashboard.component.css']
})

export class RecruiterDashboardComponent implements OnInit {
  company_name: string;
  uploaded_image_path: string;
  private recruiter: any;
  private jobList: any[] = new Array(0);
  private jobCount: any;
  private companyName: any;
  private selectedJobProfile : JobPosterModel;
  private isJobSelected: boolean;

  constructor(private _router: Router, private recruiterDashboardService: RecruiterDashboardService) {
    this.recruiterDashboardService.getJobList()
      .subscribe(
        data => {
          this.recruiter = data.data[0];

          for (let i of this.recruiter["postedJobs"]) {
            console.log("temp"+i);
            this.jobList.push(i);
          }
          this.companyName = this.recruiter["company_name"];
          this.jobCount = this.jobList.length;
        });
  }

  ngOnInit() {
    this.company_name = LocalStorageService.getLocalValue(LocalStorage.COMPANY_NAME);
    this.uploaded_image_path = LocalStorageService.getLocalValue(LocalStorage.PROFILE_PICTURE); //TODO:Get it from get user call.

    if (this.uploaded_image_path === "undefined" || this.uploaded_image_path === null) {
      this.uploaded_image_path = ImagePath.PROFILE_IMG_ICON;
    } else {
      this.uploaded_image_path = this.uploaded_image_path.substring(4, this.uploaded_image_path.length - 1).replace('"', '');
      this.uploaded_image_path = AppSettings.IP + this.uploaded_image_path;
    }
  }

  jobSelected(job : any){
      this.isJobSelected=true;
      this.selectedJobProfile = job;
  }

  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}
