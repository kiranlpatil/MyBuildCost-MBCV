
import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {JobDashboardService} from "./job-dashboard.service";
import {RecruiterJobView} from "../../model/recruiter-job-view";
import {ValueConstant} from "../../../../framework/shared/constants";
import {CandidateQCard} from "../../model/candidateQcard";
import {CandidateQListModel} from "./q-cards-candidates";

@Component({
  moduleId: module.id,
  selector:'cn-job-dashboard',
  templateUrl:'job-dashboard.component.html',
  styleUrls:['job-dashboard.component.css']

})

export class JobDashboardComponent implements OnInit {

  jobId : any;
  private recruiterJobView:RecruiterJobView = new RecruiterJobView();
  private candidateQlist : CandidateQListModel= new CandidateQListModel();
  constructor(private activatedRoute:ActivatedRoute,private jobDashboardService :JobDashboardService) {

  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.jobId = params['jobId'];
    });

    this.getJobProfile();
    this.getMatchingProfiles();
    this.getSelectedListData(ValueConstant.CART_LISTED_CANDIDATE);
  }

  getJobProfile() {
    this.jobDashboardService.getPostedJobDetails(this.jobId)
      .subscribe(
        (data: any) => {
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
    this.jobDashboardService.getSearchedcandidate(this.jobId)
      .subscribe(
        (data: any) => {
          this.recruiterJobView.numberOfMatchedCandidates=data.length;
          this.candidateQlist.matchedCandidates = data;
        });
  }

  getSelectedListData(listName : string) {
    this.jobDashboardService.getSelectedListData(this.jobId, listName)//ValueConstant.CART_LISTED_CANDIDATE)
      .subscribe(
        (data: any) => {
          switch (listName){
            case ValueConstant.CART_LISTED_CANDIDATE :
              this.candidateQlist.cartCandidates=data;
              break;
            case ValueConstant.REJECTED_LISTED_CANDIDATE :
              this.candidateQlist.rejectedCandidates=data;
              break;
            case ValueConstant.SHORT_LISTED_CANDIDATE :
              this.candidateQlist.shortListedCandidates=data;
              break;
            case ValueConstant.APPLIED_CANDIDATE :
              this.candidateQlist.appliedCandidates=data;
              break;
          }
        });
  }



}
