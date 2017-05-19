import {Component, Input, EventEmitter, Output, OnChanges, OnInit} from "@angular/core";
import {CandidateQCard} from "../model/candidateQcard";
import {JobPosterModel} from "../model/jobPoster";
import {RecruiteQCardView2Service} from "./recruiter-q-card-view2.service";
import {ImagePath, ValueConstant} from "../../../framework/shared/constants";
import {RecruitercandidatesListsService} from "../candidate-lists.service";
import {QCardViewService} from "../q-card-view/q-card-view.service";
import {RecruiterDashboardService} from "../recruiter-dashboard/recruiter-dashboard.service";
import {UpdatedIds} from "../model/updatedCandidatesIDS";
import {RecruiterDashboardButton} from "../model/buttonAtRecruiterdashboard";
import {CandidateFilter} from "../model/candidate-filter";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate} from "../model/candidate";
import {CandidateDetail} from "../../../framework/registration/candidate/candidate";
import {AddToCartIds} from "../model/addToCartModel";
import {MatchCandidate} from "../model/match-candidate";
import {QCardsortBy} from "../model/q-cardview-sortby";
import {FilterService} from "../filters/filter.service";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard-qcard-view',
  templateUrl: 'recruiter-q-card-view2.component.html',
  styleUrls: ['recruiter-q-card-view2.component.css'],

})
export class RecruiterQCardview2Component implements OnInit,OnChanges {
  @Output() addShortListedToCartIds: EventEmitter<any>= new EventEmitter<any>();
  @Output() addappliedToCartIds: EventEmitter<any>= new EventEmitter<any>();
  @Output() currentrejected: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeIDs: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeRejectedIDs: EventEmitter<any> = new EventEmitter<any>();
  @Input() candidates: CandidateQCard[];
  @Input() recruiterId: string;
  @Input() listName: string;
  @Input() jobPosterModel: JobPosterModel;
  @Input() showButton: RecruiterDashboardButton;
  private recruiter: any = {
    _id: ''
  };
  private updatedIdsModel: UpdatedIds = new UpdatedIds();
  private removeId: string;
  private selectedCandidate: Candidate = new Candidate();
  private addIdsToCartIdsModel: AddToCartIds = new AddToCartIds();
  private isFullProfileView: boolean = false;
  private secondaryCapabilities: string[] = new Array(0);
  private candidateDetails: CandidateDetail = new CandidateDetail();
  private candidateIDS = new Array();
  private candidateInCartIDS: string[] = new Array();
  private rejectedCandidatesIDS = new Array();
  private selectedJobProfile: JobPosterModel;
  private selectedPerson: CandidateQCard = new CandidateQCard();
  private image_path: string = ImagePath.PROFILE_IMG_ICON;
  private candidateRejected: CandidateQCard[] = new Array(0);
  private candidateFilter: CandidateFilter;
  private match: MatchCandidate = new MatchCandidate();
  private qCardModel: QCardsortBy = new QCardsortBy();
  private matchFormat : string;

  constructor(private recruiterQCardViewService: QCardViewService,
              private qCardView: QCardViewService,
              private profileCreatorService: CandidateProfileService,
              private recruiterDashboardService: RecruiterDashboardService,
              private filterService: FilterService,
              private qCardViewService: RecruiteQCardView2Service, private candidateLists: RecruitercandidatesListsService) {

    this.filterService.candidateFilterValue$.subscribe(
      (data: CandidateFilter) => {
        this.candidateFilter = data;
      }
    );

  }

  ngOnChanges(changes: any) {

    if (changes.jobPosterModel != undefined && changes.jobPosterModel.currentValue) {
      if (changes.jobPosterModel.currentValue.candidate_list.length != 0) {

        this.jobPosterModel = changes.jobPosterModel.currentValue;
      }
    }

  }

  ngOnInit() {
    this.matchFormat = this.match.aboveMatch;
    //this.candidates = this.candidate2;
  }


  Cancel(item: any) {
    this.recruiterQCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, item._id, this.listName, "remove").subscribe(
      user => {
        console.log(user);
      });
    let i = 0;
    for (let item1 of this.candidates) {

      if (item1._id === item._id) {
        this.candidates.splice(i, 1);
      }
      i++;
    }

    this.removeId = item._id;
    this.removeIDs.emit(this.removeId);
    if (this.listName === "rejectedList") {
      this.removeRejectedIDs.emit(this.removeId);
    }
  }
  addShortlistedTOcart(item:any){
    this.qCardView.addCandidateLists(this.recruiterId, this.jobPosterModel._id, item._id, ValueConstant.CART_LISTED_CANDIDATE, "add").subscribe(
      user => {
        console.log(user);
      });

    this.qCardView.addCandidateLists(this.recruiterId, this.jobPosterModel._id, item._id, this.listName, "remove").subscribe(
      user => {
        console.log(user);
      });
    if(this.listName==="shortListed") {
      this.addShortListedToCartIds.emit(item._id);
    }
    if(this.listName==="applied") {
      this.addappliedToCartIds.emit(item._id);
    }
    let i=0;
    for(let item1 of this.candidates){

      if(item1._id ===item._id){
        this.candidates.splice(i,1);
      }
      i++;
    }

  }
  rejectCandidate(item: any) {


    this.updatedIdsModel.updatedCandidateRejectedId = item._id;


    this.recruiterQCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, item._id, this.listName, "remove").subscribe(
      user => {
        console.log(user);
      });

    this.recruiterQCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, item._id, ValueConstant.REJECTED_LISTED_CANDIDATE, "add").subscribe(
      user => {
        console.log(user);
      });


    let i = 0;
    for (let reject of this.candidates) {

      if (reject._id === item._id) {
        this.candidates.splice(i, 1);
      }
      i++;
    }
    this.currentrejected.emit(this.updatedIdsModel);
  }

  clearFilter() {
    this.filterService.clearFilter();
  }

  viewProfile(item: any, isFullView: boolean) {
    this.isFullProfileView = isFullView;
    this.profileCreatorService.getCandidateDetailsOfParticularId(item._id).subscribe(
      candidateData => this.OnCandidateDataSuccess(candidateData),
      error => this.onError(error));
    this.selectedPerson = item;

  }

  onError(err: any) {

  }

  OnCandidateDataSuccess(candidate: any) {
    this.selectedCandidate = candidate.data;
    this.candidateDetails = candidate.metadata;
    for (let role of this.selectedCandidate.industry.roles) {
      for (let capability of role.capabilities) {
        if (capability.isSecondary) {
          this.secondaryCapabilities.push(capability.name);
        }
      }
    }
//    this.candidateDetails = candidateData.metadata;
  }

  matching(value:any) {
    this.matchFormat = value;
  }

}
