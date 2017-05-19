import {Component, OnInit} from "@angular/core";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate, Summary} from "../model/candidate";
import {CandiadteDashboardService} from "./candidate-dashboard.service";
import {JobQcard} from "../model/JobQcard";
import {LocalStorage, ValueConstant} from "../../../framework/shared/constants";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {CandidateJobListService} from "./candidate-job-list/candidate-job-list.service";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-dashboard',
  templateUrl: 'candidate-dashboard.component.html',
  styleUrls: ['candidate-dashboard.component.css']
})

export class CandidateDashboardComponent  {
  private candidate:Candidate=new Candidate();
  private jobList:JobQcard[]=new Array();
  private appliedJobs:JobQcard[]=new Array();
  private blockedJobs:JobQcard[]=new Array();
  private hidesection:boolean=false;
  private locationList:string[] = new Array(0);
  locationList2:string[] = new Array(0);
  private type:string;
  constructor(private candidateProfileService:CandidateProfileService,
              private candidateDashboardService:CandiadteDashboardService,
              private candidateJobListService:CandidateJobListService){
    this.candidateProfileService.getCandidateDetails()
      .subscribe(
        candidateData => {
          this.OnCandidateDataSuccess(candidateData);
        });

    this.candidateDashboardService.getJobList()
      .subscribe(
        data => {
          this.jobList=data;
          this.extractList(this.jobList);
        });

    this.onApplyClick();
    this.onBlockClick();
  }

  extractList(jobList:JobQcard[]){ 
    for(let job of jobList){
      var addition=job.above_one_step_matching+job.exact_matching;
      if(addition <= ValueConstant.MATCHING_PERCENTAGE){
        this.jobList.splice(this.jobList.indexOf(job),1);
      } else {
        if(this.locationList.indexOf(job.location) == -1) {
          this.locationList.push(job.location);
        }
      }
    }
    this.locationList2 = this.locationList;
  }

  OnCandidateDataSuccess(candidateData:any) {
    this.candidate = candidateData.data[0];
    this.candidate.basicInformation = candidateData.metadata;
    this.candidate.summary=new Summary();
  }

  onActionPerformOnExactList(action:string){
    for(let job of this.jobList){
      if(job._id===LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID)){
        this.jobList.splice(this.jobList.indexOf(job), 1);
      }
    }
    this.onActionPerform(action);
  }

  onActionPerformOnApproxList(action:string){
    for(let job of this.jobList){
      if(job._id===LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID)){
        this.jobList.splice(this.jobList.indexOf(job), 1);
      }
    }
    this.onActionPerform(action);
  }

  onActionPerform(action:string){
    if(action==='block'){
    this.candidate.summary.numberJobsBlocked++;
    }
    else if(action==='apply'){
      this.candidate.summary.numberOfJobApplied++;
    }
  }

  onActionOnApplyJob(action:string){
  }

  onActionOnBlockJob(action:string){
  }

  onLinkClick(type:string){
    this.hidesection=true;
    this.type=type;
    if(this.type=='apply'){
this.onApplyClick();
    }
    else if(this.type=='block'){
this.onBlockClick();
    }
  }

  onApplyClick(){
    this.candidateJobListService.getAppliedJobList()
      .subscribe(
        data => {
          this.appliedJobs=data.data;
          this.candidate.summary.numberOfJobApplied=this.appliedJobs.length;
        });

  }

  onBlockClick(){
    this.candidateJobListService.getBlockedJobList()
      .subscribe(
        data => {
          this.blockedJobs=data.data;
          this.candidate.summary.numberJobsBlocked=this.blockedJobs.length;
        });
  }
}
