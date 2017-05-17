import {Component, Input, EventEmitter, Output} from "@angular/core";
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
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate} from "../model/candidate";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard-qcard-view',
  templateUrl: 'recruiter-q-card-view2.component.html',
  styleUrls: ['recruiter-q-card-view2.component.css'],

})
export class RecruiterQCardview2Component  {
  @Output() currentrejected:EventEmitter<any> = new EventEmitter<any>();
  @Input() candidates:CandidateQCard[];
  @Input() recruiterId: string;
  @Input() listName: string;
  @Input()  jobPosterModel: JobPosterModel;
  private recruiter: any={
    _id:''
  };
  private updatedIdsModel:UpdatedIds=new UpdatedIds() ;
  private selectedCandidate : Candidate= new Candidate();
  private candidateIDS = new Array();
  private candidateInCartIDS:string[] = new Array();
  private rejectedCandidatesIDS = new Array();
  private selectedJobProfile : JobPosterModel;
  private selectedPerson:CandidateQCard = new CandidateQCard();
  private image_path:string=ImagePath.PROFILE_IMG_ICON;
  private candidateRejected:CandidateQCard[] = new Array(0);
  constructor(private recruiterQCardViewService: QCardViewService,
              private profileCreatorService:CandidateProfileService,
              private recruiterDashboardService: RecruiterDashboardService,
              private qCardViewService:RecruiteQCardView2Service,private candidateLists:RecruitercandidatesListsService) {


  }

  ngOnChanges(changes :any){

if (changes.jobPosterModel != undefined && changes.jobPosterModel.currentValue) {
 if (changes.jobPosterModel.currentValue.candidate_list.length != 0) {

 this.jobPosterModel=changes.jobPosterModel.currentValue;
     }
   }

  }





  Cancel(item:any)
  {
    this.recruiterQCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, item._id, this.listName, "remove").subscribe(
      user => {
        console.log(user);
      });


  }
  rejectCandidate(item:any)
  {


    this.updatedIdsModel.updatedCandidateRejectedId=item._id;


    this.recruiterQCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, item._id, ValueConstant.REJECTED_LISTED_CANDIDATE, "add").subscribe(
      user => {
        console.log(user);
      });
    this.recruiterQCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, item._id, ValueConstant.APPLIED_CANDIDATE, "remove").subscribe(
      user => {
        console.log(user);
      });

    this.currentrejected.emit(this.updatedIdsModel);
  }
  onClick(item:any){
    this.profileCreatorService.getCandidateDetailsOfParticularId(item._id).subscribe(
      candidateData => this.OnCandidateDataSuccess(candidateData.data),
      error => this.onError(error));
    this.selectedPerson=item;

  }

  OnCandidateDataSuccess(candidate:Candidate) {
    this.selectedCandidate = candidate;
//    this.candidateDetails = candidateData.metadata;
  }

}
