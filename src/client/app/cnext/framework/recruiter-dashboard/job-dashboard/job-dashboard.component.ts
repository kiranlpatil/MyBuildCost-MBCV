import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {JobDashboardService} from "./job-dashboard.service";
import {RecruiterJobView} from "../../model/recruiter-job-view";
import {ValueConstant} from "../../../../framework/shared/constants";
import {CandidateQListModel} from "./q-cards-candidates";
import {JobPosterModel} from "../../model/jobPoster";
import {ReferenceService} from "../../model/newClass";

@Component({
  moduleId: module.id,
  selector:'cn-job-dashboard',
  templateUrl:'job-dashboard.component.html',
  styleUrls:['job-dashboard.component.css']

})

export class JobDashboardComponent implements OnInit {

  jobId : any;
  jobCount:any;
  private  headerInfo:any;
  private recruiterJobView:RecruiterJobView = new RecruiterJobView();
  private whichListVisible : boolean[]= new Array(4);
  private candidateQlist : CandidateQListModel= new CandidateQListModel();
  private selectedJobProfile: JobPosterModel = new JobPosterModel();
  constructor(public refrence:ReferenceService,
              private activatedRoute:ActivatedRoute,
              private jobDashboardService :JobDashboardService,
              private _router : Router) {

  }
  ngOnInit() {
    this.headerInfo =  this.refrence.data;
    this.jobCount=this.headerInfo.numberOfJobposted;

    this.activatedRoute.params.subscribe(params => {
      this.jobId = params['jobId'];
    });

    this.getJobProfile();
    this.whichListVisible= new Array(4);
    this.getMatchingProfiles();

  }

  getJobProfile() {
    this.jobDashboardService.getPostedJobDetails(this.jobId)
      .subscribe(
        (data: any) => {
          this.selectedJobProfile = data.data.industry.postedJobs[0];

         for(let item of data.data.industry.postedJobs[0].candidate_list) {
           if(item.name == ValueConstant.APPLIED_CANDIDATE)
           this.recruiterJobView.numberOfCandidatesApplied =item.ids.length;
           if(item.name == ValueConstant.CART_LISTED_CANDIDATE)
           this.recruiterJobView.numberOfCandidatesInCart =item.ids.length;
           if(item.name == ValueConstant.REJECTED_LISTED_CANDIDATE)
           this.recruiterJobView.numberOfCandidatesrejected =item.ids.length;
         }
        });
  }

  getMatchingProfiles() {
    for(let i=0;i< this.whichListVisible.length;i++){
      this.whichListVisible[i]=false;
    }
    this.whichListVisible[0]= true;
    this.jobDashboardService.getSearchedcandidate(this.jobId)
      .subscribe(
        (data: any) => {
          this.jobDashboardService.getSelectedListData(this.jobId, ValueConstant.SHORT_LISTED_CANDIDATE)
            .subscribe(
              (listdata: any) => {
                this.recruiterJobView.numberOfMatchedCandidates=data.length;
                let temp = new CandidateQListModel();
                temp.shortListedCandidates=listdata.data;
                temp.matchedCandidates= data;
                this.candidateQlist =temp;
              });
        });
  }

  getSelectedListData(listName : string) {
    for(let i=0;i< this.whichListVisible.length;i++){
      this.whichListVisible[i]=false;
    }
    this.jobDashboardService.getSelectedListData(this.jobId, listName)
      .subscribe(
        (data: any) => {
          switch (listName) {
            case ValueConstant.CART_LISTED_CANDIDATE :
              this.candidateQlist.cartCandidates=data.data;
              this.whichListVisible[1]= true;
              break;
            case ValueConstant.REJECTED_LISTED_CANDIDATE :
              this.candidateQlist.rejectedCandidates=data.data;
              this.whichListVisible[3]= true;
              break;
            case ValueConstant.SHORT_LISTED_CANDIDATE :
              this.candidateQlist.shortListedCandidates=data.data;
              break;
            case ValueConstant.APPLIED_CANDIDATE :
              this.candidateQlist.appliedCandidates=data.data;
              this.whichListVisible[2]= true;
              break;
          }
        });
  }

  navigateTo(navigateTo: string, item : string) {
    if (navigateTo !== undefined ) {
      if(item) {
        this._router.navigate([navigateTo , item]);
      }else {
        this._router.navigate([navigateTo]);
      }
    }
  }



}
