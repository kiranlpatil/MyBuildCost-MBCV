import {Component, Input, EventEmitter, Output, OnChanges, OnInit} from "@angular/core";
import {CandidateQCard} from "../model/candidateQcard";
import {ShowQcardviewService} from "../showQCard.service";
import {JobPosterModel} from "../model/jobPoster";
import {QCardsortBy} from "../model/q-cardview-sortby";
import {RecruiteQCardView2Service} from "./recruiter-q-card-view2.service";
import {ImagePath, ValueConstant} from "../../../framework/shared/constants";
import {RecruitercandidatesListsService} from "../candidate-lists.service";
import {QCardViewService} from "../q-card-view/q-card-view.service";
import {RecruiterDashboardService} from "../recruiter-dashboard/recruiter-dashboard.service";
import {UpdatedIds} from "../model/updatedCandidatesIDS";
import {RecruiterDashboardButton} from "../model/buttonAtRecruiterdashboard";
import {CandidateFilter} from "../model/candidate-filter";
import {CandidateFilterService} from "../filters/candidate-filter.service";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate} from "../model/candidate";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard-qcard-view',
  templateUrl: 'recruiter-q-card-view2.component.html',
  styleUrls: ['recruiter-q-card-view2.component.css'],

})
export class RecruiterQCardview2Component implements OnInit,OnChanges {
  @Output() currentrejected:EventEmitter<any> = new EventEmitter<any>();
  @Output() removeIDs:EventEmitter<any> = new EventEmitter<any>();
  @Output() removeRejectedIDs:EventEmitter<any> = new EventEmitter<any>();
  @Input() candidates:CandidateQCard[];
  @Input() recruiterId: string;
  @Input() listName: string;
  @Input()  jobPosterModel: JobPosterModel;
  @Input()  showButton: RecruiterDashboardButton;
  private recruiter: any={
    _id:''
  };
  private updatedIdsModel:UpdatedIds=new UpdatedIds() ;
  private removeId:string;
  private selectedCandidate : Candidate= new Candidate();
  private candidateIDS = new Array();
  private candidateInCartIDS:string[] = new Array();
  private rejectedCandidatesIDS = new Array();
  private selectedJobProfile : JobPosterModel;
  private selectedPerson:CandidateQCard = new CandidateQCard();
  private image_path:string=ImagePath.PROFILE_IMG_ICON;
  private candidateRejected:CandidateQCard[] = new Array(0);
  private candidateFilter: CandidateFilter;

   constructor(private recruiterQCardViewService: QCardViewService,
              private profileCreatorService:CandidateProfileService,
              private recruiterDashboardService: RecruiterDashboardService,
               private candidateFilterService: CandidateFilterService,
              private qCardViewService:RecruiteQCardView2Service,private candidateLists:RecruitercandidatesListsService) {

    this.candidateFilterService.candidateFilterValue$.subscribe(
      (data: CandidateFilter) => {
        this.candidateFilter = data;
      }
    );

  }

  ngOnChanges(changes :any){

if (changes.jobPosterModel != undefined && changes.jobPosterModel.currentValue) {
 if (changes.jobPosterModel.currentValue.candidate_list.length != 0) {

 this.jobPosterModel=changes.jobPosterModel.currentValue;
     }
   }

  }

   ngOnInit() {
  //this.candidates = this.candidate2;
   }


  Cancel(item:any)
  {
    this.recruiterQCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, item._id, this.listName, "remove").subscribe(
      user => {
        console.log(user);
      });
    let i=0;
    for(let item1 of this.candidates){

      if(item1._id ===item._id){
        this.candidates.splice(i,1);
      }
      i++;
    }

    this.removeId=item._id;
    this.removeIDs.emit(this.removeId);
    this.removeRejectedIDs.emit(this.removeId);
  }
  rejectCandidate(item:any)
  {


    this.updatedIdsModel.updatedCandidateRejectedId=item._id;


    this.recruiterQCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, item._id,this.listName, "remove").subscribe(
      user => {
        console.log(user);
      });

    this.recruiterQCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, item._id, ValueConstant.REJECTED_LISTED_CANDIDATE, "add").subscribe(
      user => {
        console.log(user);
      });


    let i=0;
    for(let reject of this.candidates){

      if(reject._id ===item._id){
        this.candidates.splice(i,1);
      }
      i++;
    }
    this.currentrejected.emit(this.updatedIdsModel);
  }
  clearFilter() {
  this.candidateFilterService.clearFilter();
  }
  onClick(item:any){
    this.profileCreatorService.getCandidateDetailsOfParticularId(item._id).subscribe(
      candidateData => this.OnCandidateDataSuccess(candidateData.data),
      error => this.onError(error));
    this.selectedPerson=item;

  }
  onError(err:any) {

  }

  OnCandidateDataSuccess(candidate:Candidate) {
    this.selectedCandidate = candidate;
//    this.candidateDetails = candidateData.metadata;
  }

}
