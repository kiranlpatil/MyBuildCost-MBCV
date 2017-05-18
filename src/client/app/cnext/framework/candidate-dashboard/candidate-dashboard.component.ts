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


    /*this.jobList= [
      {
        "below_one_step_matching": 12.5,
        "above_one_step_matching": 6.25,
        "exact_matching": 18.75,
        "matching": 37.5,
        "company_name": "TechPrimeLab software private ltd ,Pune",
        "salary": "3-5 Lakhs",
        "experience": "3",
        "education": "Under Graduate",
        "interestedIndustries": [
          "IT",
          "Education"
        ],
        "proficiencies": [
          "C",
          "C++",
          "core Java",
          "java"
        ],
        "_id": "590c623c4b048631123affb8"
      },
      {
        "below_one_step_matching": 0,
        "above_one_step_matching": 6.25,
        "exact_matching": 12.5,
        "matching": 18.75,
        "company_name": "TechPrimeLab software private ltd ,Pune",
        "salary": "5-8 Lakhs",
        "experience": "3",
        "education": "Graduate",
        "interestedIndustries": [
          "IT",
          "Education"
        ],
        "proficiencies": [
          "C",
          "C++",
          "core Java",
          "java"
        ],
        "_id": "59158bb1acea03e80f07b71"
      },
      {
        "below_one_step_matching": 0,
        "above_one_step_matching": 0,
        "exact_matching": 0,
        "matching": 0,
        "company_name": "TechPrimeLab software private ltd ,Pune",
        "salary": "3 Lakh",
        "experience": "3 year",
        "education": "Under Graduate",
        "interestedIndustries": [
          "IT",
          "Education"
        ],
        "proficiencies": [
          "C",
          "C++"
        ],
        "_id": "59158bb1acea03e80f07b7e4"
      },
      {
        "below_one_step_matching": 6.25,
        "above_one_step_matching": 0,
        "exact_matching": 6.25,
        "matching": 12.5,
        "company_name": "TechPrimeLab software private ltd ,Pune",
        "salary": "2 Lakh",
        "experience": "2 year",
        "education": "Graduate",
        "interestedIndustries": [
          "Healthcare"
        ],
        "proficiencies": [
          "C",
          "C++"
        ],
        "_id": "59158bb1acea03e80f07b7e6"
      },
      {
        "below_one_step_matching": 0,
        "above_one_step_matching": 0,
        "exact_matching": 0,
        "matching": 0,
        "company_name": "TechPrimeLab software private ltd ,Pune",
        "salary": "4 Lakh",
        "experience": "3 year",
        "education": "Under Graduate",
        "interestedIndustries": [
          "IT",
          "Education"
        ],
        "proficiencies": [
          "C++",
          "angular 4",
          "Bistro"
        ],
        "_id": "59158bb1acea03e80f07b7e7"
      },
      {
        "below_one_step_matching": 0,
        "above_one_step_matching": 0,
        "exact_matching": 0,
        "matching": 0,
        "company_name": "TechPrimeLab software private ltd ,Pune",
        "salary": "3 Lakh",
        "experience": "4 year",
        "education": "Graduate",
        "interestedIndustries": [
          "IT"
        ],
        "proficiencies": [
          "ABC ALGOL",
          "C",
          "C++"
        ],
        "_id": "59158bb1acea03e80f07b7e6"
      },
      {
        "below_one_step_matching": 0,
        "above_one_step_matching": 0,
        "exact_matching": 0,
        "matching": 0,
        "company_name": "TechPrimeLab software private ltd ,Pune",
        "salary": "4 Lakh",
        "experience": "3 year",
        "education": "Post Graduate",
        "interestedIndustries": [
          "IT"
        ],
        "proficiencies": [
          "ABC"
        ],
        "_id": "59158bb1acea03e80f07b7e0"
      },
      {
        "below_one_step_matching": 0,
        "above_one_step_matching": 6.25,
        "exact_matching": 12.5,
        "matching": 18.75,
        "company_name": "tpl",
        "company_size": "50-100",
        "salary": "5-8 Lakhs",
        "experience": "3",
        "education": "Graduate",
        "interestedIndustries": [
          "IT"
        ],
        "proficiencies": [
          "C",
          "C++"
        ],
        "_id": "59158bb1acea03e80f07b7e9"
      },
      {
        "below_one_step_matching": 0,
        "above_one_step_matching": 0,
        "exact_matching": 0,
        "matching": 0,
        "company_name": "tpl",
        "company_size": "50-100",
        "salary": "2 Lakh",
        "experience": "3 year",
        "education": "Under Graduate",
        "interestedIndustries": [
          "Healthcare"
        ],
        "proficiencies": [
          "C",
          "C++"
        ],
        "_id": "59158bb1acea03e80f07b7e0"
      },
      {
        "below_one_step_matching": 31.25,
        "above_one_step_matching": 6.25,
        "exact_matching": 25,
        "matching": 62.5,
        "company_name": "tpl",
        "company_size": "50-100",
        "salary": "2 Lakh",
        "experience": "5 year",
        "education": "Graduate",
        "interestedIndustries": [
          "IT",
          "Healthcare",
          "Education",
          "Mfg-1"
        ],
        "proficiencies": [
          "java ",
          "ABC",
          "C",
          "C++",
          "php",
          "cobol"
        ],
        "_id": "59158bb1acea03e80f07b7e2"
      },
      {
        "below_one_step_matching": 25,
        "above_one_step_matching": 12.5,
        "exact_matching": 31.25,
        "matching": 68.75,
        "company_name": "tpl",
        "company_size": "50-100",
        "salary": "3 Lakh",
        "experience": "3 year",
        "education": "Post Graduate",
        "interestedIndustries": [
          "IT",
          "Education",
          "Healthcare"
        ],
        "proficiencies": [
          "java",
          "ABC",
          "C",
          "php",
          "cobol"
        ],
        "location": "Bangalore Urban",
        "_id": "59158bb1acea03e80f07b7e2"
      }
    ];
this.appliedJobs=this.jobList;
    this.blockedJobs=this.jobList;
    this.extractList(this.jobList);*/
    /*[
        {
          "salary": "2 Lakh",
          "experience": "3 year",
          "education": "Graduate",
          "jobTitle": "adsdasSCA",
          "location": "pune",
          "matching": "70",
          "_id": "591acdcd48998f4579e6bd03",
          "company_name": "tpl",
          "company_size": "Below 50",
          "recruiterId": "58f9c7b2ceecc6d21493c9f1",
          "proficiencies": [
            "ABC",
            "ABC ALGOL",
            "ABSYS",
            "Bertrand",
            "ABSET"
          ],
          "company_logo": "hgadsgg",
          "joiningPeriod": "1-2 months",
          "companyAge": "2 years"
        },
        {
          "salary": "2 Lakh",
          "experience": "3 year",
          "education": "Graduate",
          "jobTitle": "adsdasSCA",
          "location": "pune",
          "matching": "70",
          "_id": "591acdcd48998f4579e6bd03",
          "company_name": "tpl",
          "company_size": "Below 50",
          "recruiterId": "58f9c7b2ceecc6d21493c9f1",
          "proficiencies": [
            "ABC",
            "ABC ALGOL",
            "ABSYS",
            "Bertrand",
            "ABSET"
          ],
          "company_logo": "hgadsgg",
          "joiningPeriod": "1-2 months",
          "companyAge": "2 years"
        },
        {
          "salary": "2 Lakh",
          "experience": "3 year",
          "education": "Graduate",
          "jobTitle": "adsdasSCA",
          "location": "pune",
          "matching": "50",
          "_id": "591acdcd48998f4579e6bd03",
          "company_name": "tpl",
          "company_size": "Below 50",
          "recruiterId": "58f9c7b2ceecc6d21493c9f1",
          "proficiencies": [
            "ABC",
            "ABC ALGOL",
            "ABSYS",
            "Bertrand",
            "ABSET"
          ],
          "company_logo": "hgadsgg",
          "joiningPeriod": "1-2 months",
          "companyAge": "2 years"
        },
        {
          "salary": "2 Lakh",
          "experience": "3 year",
          "education": "Graduate",
          "jobTitle": "adsdasSCA",
          "location": "pune",
          "matching": "20",
          "_id": "591acdcd48998f4579e6bd03",
          "company_name": "tpl",
          "company_size": "Below 50",
          "recruiterId": "58f9c7b2ceecc6d21493c9f1",
          "proficiencies": [
            "ABC",
            "ABC ALGOL",
            "ABSYS",
            "Bertrand",
            "ABSET"
          ],
          "company_logo": "hgadsgg",
          "joiningPeriod": "1-2 months",
          "companyAge": "2 years"
        },
        {
          "salary": "2 Lakh",
          "experience": "3 year",
          "education": "Graduate",
          "jobTitle": "adsdasSCA",
          "location": "pune",
          "matching": "30",
          "_id": "591acdcd48998f4579e6bd03",
          "company_name": "tpl",
          "company_size": "Below 50",
          "recruiterId": "58f9c7b2ceecc6d21493c9f1",
          "proficiencies": [
            "ABC",
            "ABC ALGOL",
            "ABSYS",
            "Bertrand",
            "ABSET"
          ],
          "company_logo": "hgadsgg",
          "joiningPeriod": "1-2 months",
          "companyAge": "2 years"
        },
        {
          "salary": "2 Lakh",
          "experience": "3 year",
          "education": "Graduate",
          "jobTitle": "adsdasSCA",
          "location": "pune",
          "matching": "55",
          "_id": "591acdcd48998f4579e6bd03",
          "company_name": "tpl",
          "company_size": "Below 50",
          "recruiterId": "58f9c7b2ceecc6d21493c9f1",
          "proficiencies": [
            "ABC",
            "ABC ALGOL",
            "ABSYS",
            "Bertrand",
            "ABSET"
          ],
          "company_logo": "hgadsgg",
          "joiningPeriod": "1-2 months",
          "companyAge": "2 years"
        },
        {
          "salary": "2 Lakh",
          "experience": "3 year",
          "education": "Graduate",
          "jobTitle": "adsdasSCA",
          "location": "pune",
          "matching": "50",
          "_id": "591acdcd48998f4579e6bd03",
          "company_name": "tpl",
          "company_size": "Below 50",
          "recruiterId": "58f9c7b2ceecc6d21493c9f1",
          "proficiencies": [
            "ABC",
            "ABC ALGOL",
            "ABSYS",
            "Bertrand",
            "ABSET"
          ],
          "company_logo": "hgadsgg",
          "joiningPeriod": "1-2 months",
          "companyAge": "2 years"
        }
      ]*/


  }

  extractList(jobList:JobQcard[]){
    for(let job of jobList){
      var addition=job.above_one_step_matching+job.exact_matching;
      if(addition <= ValueConstant.MATCHING_PERCENTAGE){
        this.jobList.splice(this.jobList.indexOf(job),1);
      }
    }
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
