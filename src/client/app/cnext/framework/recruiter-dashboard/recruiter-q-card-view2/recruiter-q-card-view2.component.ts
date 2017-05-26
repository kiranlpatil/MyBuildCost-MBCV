import {Component, Input, EventEmitter, Output, OnChanges, OnInit} from "@angular/core";
import {CandidateQCard} from "../../model/candidateQcard";
import {JobPosterModel} from "../../model/jobPoster";
import {RecruiterDashboardButton} from "../../model/buttonAtRecruiterdashboard";
import {UpdatedIds} from "../../model/updatedCandidatesIDS";
import {Candidate} from "../../model/candidate";
import {AddToCartIds} from "../../model/addToCartModel";
import {CandidateDetail} from "../../../../framework/registration/candidate/candidate";
import {AppSettings, ImagePath, ValueConstant} from "../../../../framework/shared/constants";
import {QCardsortBy} from "../../model/q-cardview-sortby";
import {QCardViewService} from "../q-card-view/q-card-view.service";
import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";
import {RecruiterDashboardService} from "../recruiter-dashboard.service";
import {QCardFilterService} from "../../filters/q-card-filter.service";
import {RecruitercandidatesListsService} from "../../candidate-lists.service";
//import {RecruiteQCardView2Service} from "./recruiter-q-card-view2.service";
import {QCardFilter} from "../../model/q-card-filter";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-dashboard-qcard-view',
  templateUrl: 'recruiter-q-card-view2.component.html',
  styleUrls: ['recruiter-q-card-view2.component.css'],

})
export class RecruiterQCardview2Component {
 /* @Output() addShortListedToCartIds: EventEmitter<any>= new EventEmitter<any>();
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
  private candidateFilter: QCardFilter;
  private qCardModel: QCardsortBy = new QCardsortBy();
  private showModalStyle:boolean = false;
  private qCardCount = {count:0};

  constructor(private recruiterQCardViewService: QCardViewService,
              private qCardView: QCardViewService,
              private profileCreatorService: CandidateProfileService,
              private recruiterDashboardService: RecruiterDashboardService,
              private qCardFilterService: QCardFilterService,
              private qCardViewService: RecruiteQCardView2Service, private candidateLists: RecruitercandidatesListsService) {

    this.qCardFilterService.candidateFilterValue$.subscribe(
      (data: QCardFilter) => {
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
    this.qCardCount.count = this.candidates.length;
  }

  ngOnInit() {
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
    this.showModalStyle=false;

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
    this.showModalStyle=false;
  }

  clearFilter() {
    this.qCardFilterService.clearFilter();
  }

  viewProfile(item: any, isFullView: boolean) {
    this.isFullProfileView = isFullView;
    this.profileCreatorService.getCandidateDetailsOfParticularId(item._id).subscribe(
      candidateData => this.OnCandidateDataSuccess(candidateData),
      error => this.onError(error));
    this.selectedPerson = item;
this.showModalStyle=true;

  }

  onError(err: any) {

  }

  getStyleModal() {//TODO remove this from all model
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
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

  getImagePath(imagePath:string){
  if(imagePath != undefined){
    return AppSettings.IP + imagePath.substring(4).replace('"', '');
  }

  return null;
}*/

}
