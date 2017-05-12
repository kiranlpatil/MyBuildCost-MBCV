import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage, ImagePath, AppSettings, NavigationRoutes} from "../../../framework/shared/constants";
import {RecruiterDashboardService} from "./recruiter-dashboard.service";
import {JobPosterModel} from "../model/jobPoster";
import {RecruiteQCardView2Service} from "../recruiter-q-card-view2/recruiter-q-card-view2.service";
import {CandidateQCard} from "../model/candidateQcard";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard',
  templateUrl: 'recruiter-dashboard.component.html',
  styleUrls: ['recruiter-dashboard.component.css']
})

export class RecruiterDashboardComponent implements OnInit {
  company_name: string;
  uploaded_image_path: string;
  private recruiter: any={
    _id:''
  };
  private jobList: any[] = new Array(0);
  private jobCount: any;
  private companyName: any;
  private selectedJobProfile : JobPosterModel;
  private isJobSelected: boolean;
  private isshortedListSelected: boolean;
  private showShortlisted: boolean;
  private showQCard: boolean;
  private candidateIDS = new Array();
  private candidateInCartIDS = new Array();
  private rejectedCandidatesIDS = new Array();
  private appliedCandidatesIDS = new Array();
  private candidates:CandidateQCard[] = new Array(0);


  constructor(private _router: Router, private recruiterDashboardService: RecruiterDashboardService,private qCardViewService:RecruiteQCardView2Service) {
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
  rejectedCandidates() {
    this.showQCard=true;
    this.candidates=[];
    if(this.rejectedCandidatesIDS.length!==0){
      this.qCardViewService.getCandidatesdetails(this.rejectedCandidatesIDS,this.selectedJobProfile)
        .subscribe(
          data => {
            this.candidates=data;
          });
    }
  }
  appliedCandidates(){
    this.showQCard=true;
    this.candidates=[];
    if(this.appliedCandidatesIDS.length!==0){
      this.qCardViewService.getCandidatesdetails(this.appliedCandidatesIDS,this.selectedJobProfile)
        .subscribe(
          data => {
            this.candidates=data;
          });

    }

  }
  showMatchedCandidate()
  {
    this.showQCard=false;

  }
  showShortlistedCandidate() {
    this.showQCard=true;
    this.candidates=[];
    if(this.candidateIDS.length!==0){
      this.qCardViewService.getCandidatesdetails(this.candidateIDS,this.selectedJobProfile)
        .subscribe(
          data => {
            this.candidates=data;
          });

    }
  }
  candidateInCart() {
    this.showQCard=true;
    this.candidates=[];
    if(this.candidateInCartIDS.length != 0){
      this.qCardViewService.getCandidatesdetails(this.candidateInCartIDS,this.selectedJobProfile)
        .subscribe(
          data => {
            this.candidates=data;
          });

    }
  }
  ShortlistedCandidate()
  {

    this.showQCard=true;
    this.candidates=[];
    if(this.candidateIDS.length != 0){
      this.qCardViewService.getCandidatesdetails(this.candidateIDS,this.selectedJobProfile)
        .subscribe(
          data => {
            this.candidates=data;
          });

    }
  }
  jobSelected(job : any){
      this.isJobSelected=true;
      this.selectedJobProfile = job;
      if(this.selectedJobProfile.candidate_list.length != 0){
        for(let item of this.selectedJobProfile.candidate_list){
          if(item.name == "shortListed"){
            this.candidateIDS.push(item.ids);
          }
          if(item.name == "cartListed"){
            this.candidateInCartIDS.push(item.ids);
          }
          if(item.name == "rejectedList"){
            this.rejectedCandidatesIDS.push(item.ids);
          }
          /*if(this.selectedJobProfile.candidate_list[item].name = "applied"){
            this.appliedCandidatesIDS.push(item);
          }*/
        }
      }

  }

  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}
