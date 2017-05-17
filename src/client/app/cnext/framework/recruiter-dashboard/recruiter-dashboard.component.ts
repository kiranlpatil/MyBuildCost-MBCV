import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {
  LocalStorage, ImagePath, AppSettings, NavigationRoutes,
  ValueConstant
} from "../../../framework/shared/constants";
import {RecruiterDashboardService} from "./recruiter-dashboard.service";
import {JobPosterModel} from "../model/jobPoster";
import {RecruiteQCardView2Service} from "../recruiter-q-card-view2/recruiter-q-card-view2.service";
import {CandidateQCard} from "../model/candidateQcard";
import {RecruitercandidatesListsService} from "../candidate-lists.service";
import {CandidateFilterService} from "../filters/candidate-filter.service";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard',
  templateUrl: 'recruiter-dashboard.component.html',
  styleUrls: ['recruiter-dashboard.component.css']
})

export class RecruiterDashboardComponent implements OnInit {
  company_name: string;
  uploaded_image_path: string;
  public shortList:any= ValueConstant.SHORT_LISTED_CANDIDATE;
  public cartList:any= ValueConstant.CART_LISTED_CANDIDATE;
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
  private candidateIDS = new Array(0);
  private candidateInCartIDS:string[] = new Array(0);
  private ids = new Array();
  private rejectedCandidatesIDS = new Array();
  private appliedCandidatesIDS = new Array();
  private candidates:CandidateQCard[] = new Array(0);

  private candidatesInCart:CandidateQCard[] ;
  private candidatesshortlisted:CandidateQCard[] = new Array(0);
  private candidateApplied:CandidateQCard[] = new Array(0);
  private candidateRejected:CandidateQCard[] = new Array(0);




  constructor(private candidateFilterService: CandidateFilterService,private _router: Router, private recruiterDashboardService: RecruiterDashboardService,
              private qCardViewService:RecruiteQCardView2Service,private candidateLists:RecruitercandidatesListsService) {
    this.recruiterDashboardService.getJobList()
      .subscribe(
        data => {if( data.data[0] != undefined)
          this.recruiter = data.data[0];

          for (let i of this.recruiter["postedJobs"]) {
            console.log("temp"+i);
            this.jobList.push(i);
          }
          this.companyName = this.recruiter["company_name"];
          if( this.jobList.length >= 0)
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
    this.candidateFilterService.clearFilter();

    if(this.rejectedCandidatesIDS.length>0) {
      this.qCardViewService.getCandidatesdetails(this.rejectedCandidatesIDS, this.selectedJobProfile)
        .subscribe(
          data => {
            this.candidateRejected = data;
          });
    }

  }
  appliedCandidates(){
    this.showQCard=true;
    this.candidateFilterService.clearFilter();
    this.candidates=[];
    if(this.appliedCandidatesIDS.length>0) {
      this.qCardViewService.getCandidatesdetails(this.appliedCandidatesIDS, this.selectedJobProfile)
        .subscribe(
          data => {
            this.candidateApplied = data;
          });
    }

  }
  showMatchedCandidate()
  {
    this.showQCard=false;
    this.candidateFilterService.clearFilter();

  }
  showShortlistedCandidate() {
    this.showQCard=true;
    this.candidateFilterService.clearFilter();
    this.candidates=[];
    if(this.candidateInCartIDS.length>0) {
      this.qCardViewService.getCandidatesdetails(this.candidateIDS, this.selectedJobProfile)
        .subscribe(
          data => {
            this.candidatesshortlisted = data;
          });
    }
  }

  rejectedIds(model:any)
  {
    this.showQCard=true;
    this.candidates=[];
    if(model.updatedCandidateRejectedId!=undefined)
    {
      this.rejectedCandidatesIDS.push(model.updatedCandidateRejectedId);}

    this.qCardViewService.getCandidatesdetails(this.rejectedCandidatesIDS, this.selectedJobProfile)
      .subscribe(
        data => {
          this.candidateRejected = data;
        });
  }
  updateIds(model:any) {
    this.showQCard=true;
    this.candidates=[];
    if(model.updatedCandidateIncartId!=undefined)
    {
      this.candidateInCartIDS.push(model.updatedCandidateIncartId);
    }

      if(model.updatedCandidateInShortlistId!=undefined)
    {
      this.candidateIDS.push(model.updatedCandidateInShortlistId);
    }


    this.qCardViewService.getCandidatesdetails(this.candidateInCartIDS,this.selectedJobProfile)
      .subscribe(
        data => {
          this.candidatesInCart=data;
        });
    this.qCardViewService.getCandidatesdetails(this.candidateIDS,this.selectedJobProfile)
      .subscribe(
        data => {
          this.candidatesshortlisted=data;
        });
    this.qCardViewService.getCandidatesdetails(this.rejectedCandidatesIDS, this.selectedJobProfile)
      .subscribe(
        data => {
          this.candidateRejected = data;
        });

  }
  candidateInCart() {
    this.showQCard=true;
    this.candidateFilterService.clearFilter();
    if(this.candidateInCartIDS.length>0) {
      this.qCardViewService.getCandidatesdetails(this.candidateInCartIDS, this.selectedJobProfile)
        .subscribe(
          data => {
            this.candidatesInCart = data;
          });
    }
  }

  jobSelected(job : any){
      this.isJobSelected=true;
      this.selectedJobProfile = job;
      if(this.selectedJobProfile.candidate_list.length != 0){
        for(let item of this.selectedJobProfile.candidate_list){
          if(item.name == "shortListed"){
            if(item.ids.length>0) {
              this.candidateIDS = item.ids;
            }
          }
          if(item.name == "cartListed"){
            if(item.ids.length>0){
              this.candidateInCartIDS= item.ids;
            }
          }
          if(item.name == "rejectedList"){
            if(item.ids.length>0) {
              this.rejectedCandidatesIDS = item.ids;
            }
          }
          if(item.name == "applied"){
            if(item.ids.length>0) {
              this.appliedCandidatesIDS = item.ids;
            }
          }
        }
      }
  }

  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}
