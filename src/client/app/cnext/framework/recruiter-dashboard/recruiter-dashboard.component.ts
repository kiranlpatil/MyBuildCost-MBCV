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
import {RecruiterDashboardButton} from "../model/buttonAtRecruiterdashboard";
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
  public appliedList:any= ValueConstant.APPLIED_CANDIDATE;
  public rejecteList:any= ValueConstant.REJECTED_LISTED_CANDIDATE;
  private recruiter: any={
    _id:''
  };
  private jobList: any[] = new Array(0);
  private jobCount: any;
  private companyName: any;
  private selectedJobProfile : JobPosterModel;
  private isJobSelected: boolean;
  private isRejectedCandidateAdd: boolean=false;
  private isshortedListSelected: boolean;
  private showShortlisted: boolean;
  private showQCard: boolean;
  private candidateIDS = new Array(0);
  private candidateInCartIDS:string[] = new Array(0);
  private ids = new Array();
  private isIdDuplicate:boolean=false;
  private rejectedCandidatesIDS = new Array();
  private appliedCandidatesIDS = new Array();
  private candidates:CandidateQCard[] = new Array(0);
  private buttonModel:RecruiterDashboardButton= new RecruiterDashboardButton();

  private candidatesInCart:CandidateQCard[] ;
  private candidatesshortlisted:CandidateQCard[] = new Array(0);
  private candidateApplied:CandidateQCard[] = new Array(0);
  private candidateRejected:CandidateQCard[] = new Array(0);
  private newcandidateRejected:CandidateQCard[] = new Array(0);
  private newcandidates: CandidateQCard[] = new Array();

  private removeFromlist:string[]=new Array() ;
  private removerejectedList:string[]=new Array() ;

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
    this.buttonModel.isShowRemoveButton=true;
    this.buttonModel.isShowViewProfileButton=true;
    this.buttonModel.isShowRejectButton=false;
    this.showQCard=true;
    this.candidateFilterService.clearFilter();
  if (this.removerejectedList.length > 0 || this.removerejectedList != undefined) {
      let i=0;
      for (let item1 of this.rejectedCandidatesIDS) {

        for (let item2 of this.removerejectedList) {

          if (item1 === item2) {
            this.rejectedCandidatesIDS.splice(i, 1);
          }


        }
        i++;
      }

    }

    if(this.rejectedCandidatesIDS.length>0) {
      this.qCardViewService.getCandidatesdetails(this.rejectedCandidatesIDS, this.selectedJobProfile)
        .subscribe(
          data => {
            this.candidateRejected= data;
          });
    }

  }
  appliedCandidates(){
    this.buttonModel.isShowRemoveButton=false;
    this.buttonModel.isShowViewProfileButton=true;
    this.buttonModel.isShowRejectButton=true;

    this.showQCard=true;
    this.candidateFilterService.clearFilter();
    this.candidates=[];
    if(this.appliedCandidatesIDS.length>0) {
      let i=0
      for (let item1 of this.appliedCandidatesIDS) {
        for (let item2 of this.removeFromlist) {

          if (item1 === item2) {
            this.appliedCandidatesIDS.splice(i, 1);
          }


        }
        i++;
      }

    }
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
    if(this.removeFromlist.length>0) {
      this.qCardViewService.getCandidatesdetails(this.removeFromlist, this.selectedJobProfile)
        .subscribe(
          data => {
            this.newcandidates = data;

          });
    }

  }
  showShortlistedCandidate() {
    this.buttonModel.isShowRemoveButton=true;
    this.buttonModel.isShowViewProfileButton=true;
    this.buttonModel.isShowRejectButton=true;

    this.showQCard=true;
    this.candidateFilterService.clearFilter();
    this.candidates=[];
    if (this.removeFromlist.length > 0 || this.removeFromlist != undefined) {
let i=0;
      for (let item1 of this.candidateIDS) {

        for (let item2 of this.removeFromlist) {

          if (item1 === item2) {
            this.candidateIDS.splice(i, 1);
          }


        }
        i++;
      }

    }

    if(this.candidateIDS.length>0) {
      this.qCardViewService.getCandidatesdetails(this.candidateIDS, this.selectedJobProfile)
        .subscribe(
          data => {
            this.candidatesshortlisted = data;
          });
    }
  }
  removeFromRejectedList(reject:any)
  {
    for(let item of  this.removerejectedList){
      if(item === reject){
        this.isIdDuplicate=true;
      }}
    if(this.isIdDuplicate===false){
      this.removerejectedList.push(reject);

    }
    this.isIdDuplicate=false;
  }
  removeFromIds(reject:any)
  {
    for(let item of  this.removeFromlist){
      if(item === reject){
        this.isIdDuplicate=true;
      }}
   if(this.isIdDuplicate===false){
     this.removeFromlist.push(reject);

    }
    this.isIdDuplicate=false;
  }
  rejectedIds(model:any)
  {
    this.showQCard=true;
    this.candidates=[];
    if(model.updatedCandidateRejectedId!=undefined){
   let i=0;
      for(let item of this.removerejectedList){
        if(item===model.updatedCandidateRejectedId){
          this.removerejectedList.splice(i,1);
        }
        i++;
      }}

    for(let item of  this.removeFromlist){
      if(item === model.updatedCandidateRejectedId){
        this.isIdDuplicate=true;
      }}
    if(this.isIdDuplicate===false){
      this.removeFromlist.push(model.updatedCandidateRejectedId);

    }
    this.isIdDuplicate=false;
    if(model.updatedCandidateRejectedId!=undefined)
    {
      this.rejectedCandidatesIDS.push(model.updatedCandidateRejectedId);}


  }
  updateIds(model:any) {
    this.showQCard=true;
    this.candidates=[];

    if(model.updatedCandidateIncartId!=undefined)
    { let i=0;
      this.candidateInCartIDS.push(model.updatedCandidateIncartId);
      for(let item of this.removeFromlist){
        if(item===model.updatedCandidateIncartId){
          this.removeFromlist.splice(i,1);
        }
        i++;
      }
    }

      if(model.updatedCandidateInShortlistId!=undefined)
    {let i=0;
      this.candidateIDS.push(model.updatedCandidateInShortlistId);
      for(let item of this.removeFromlist){
        if(item===model.updatedCandidateInShortlistId){
          this.removeFromlist.splice(i,1);
        }
        i++;
      }
    }

  }
  candidateInCart() {
    this.showQCard=true;
    this.candidateFilterService.clearFilter();
    this.buttonModel.isShowRemoveButton=true;
    this.buttonModel.isShowViewProfileButton=true;
    this.buttonModel.isShowRejectButton=true;

    if (this.removeFromlist.length > 0 || this.removeFromlist != undefined) {
let i=0;
      for (let item1 of this.candidateInCartIDS) {

        for (let item2 of this.removeFromlist) {

          if (item1 === item2) {
            this.candidateInCartIDS.splice(i, 1);
          }


        }
        i++;
      }

    }


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
