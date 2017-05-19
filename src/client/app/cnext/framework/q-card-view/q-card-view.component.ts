import {Component, Input, OnChanges, OnInit, Output, EventEmitter} from "@angular/core";
import {CandidateQCard} from "../model/candidateQcard";
import {ShowQcardviewService} from "../showQCard.service";
import {QCardViewService} from "./q-card-view.service";
import {JobPosterModel} from "../model/jobPoster";
import {QCardsortBy} from "../model/q-cardview-sortby";
import {CandidateFilter} from "../model/candidate-filter";
import {ValueConstant} from "../../../framework/shared/constants";
import {UpdatedIds} from "../model/updatedCandidatesIDS";
import {RecruiteQCardView2Service} from "../recruiter-q-card-view2/recruiter-q-card-view2.service";
import {MatchCandidate} from "../model/match-candidate";
import {FilterService} from "../filters/filter.service";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate} from "../model/candidate";
import {CandidateDetail} from "../../../framework/registration/candidate/candidate";

@Component({
  moduleId: module.id,
  selector: 'cn-q-card-view',
  templateUrl: 'q-card-view.component.html',
  styleUrls: ['q-card-view.component.css'],

})
export class QCardviewComponent implements OnInit, OnChanges {
  @Output() updatedIds = new EventEmitter<UpdatedIds>();
  private selectedCandidate: Candidate = new Candidate();
  private candidateDetails: CandidateDetail = new CandidateDetail();
  private candidates: CandidateQCard[] = new Array();
  private candidates2: any[] = new Array();
  private selectedPerson: CandidateQCard = new CandidateQCard();
  private showMatchedCandidateButton: boolean;
  private candidateSeenIDS = new Array();
  private candidateshortlisted = new Array();
  private updatedIdsModel: UpdatedIds = new UpdatedIds();
  private toggle: boolean = false;
  private matches: number;
  private isCandidateAdd: boolean = false;
  private qCardModel: QCardsortBy = new QCardsortBy();
  private match: MatchCandidate = new MatchCandidate();
  private isShowQCardView: boolean;
  private candidateFilter: CandidateFilter;
  private matchFormat: string;
  private showModalStyle: boolean = false;
  @Output() latestSearchResultCount  = new EventEmitter<number>();

  @Input() private jobPosterModel: JobPosterModel;
  @Input() private recruiterId: string;
  @Input() private addToSerchIds: CandidateQCard[];

  private shortlisted: boolean = false;

  constructor(private qCardViewService: QCardViewService,
              private profileCreatorService: CandidateProfileService,
              private cardViewService: RecruiteQCardView2Service,
              private showQCardview: ShowQcardviewService, private filterService: FilterService) {

    this.filterService.candidateFilterValue$.subscribe(
      (data: CandidateFilter) => {
        this.candidateFilter = data;
        console.log('filter data', this.candidateFilter);
      }
    );
    this.filterService.aboveMatch$.subscribe(
      () => {
        this.matchFormat = this.match.aboveMatch
      }
    );
  }

  ngOnChanges(changes: any) {
    if (changes.jobPosterModel != undefined && changes.jobPosterModel.currentValue) {
      this.showQCardView();
      if (changes.jobPosterModel.currentValue.candidate_list.length != 0) {
        for (let item of changes.jobPosterModel.currentValue.candidate_list[0].ids) {
          this.candidateSeenIDS.push(item);
        }
      }

    }
    for (let item1 of this.candidates) {
      let i = 0;
      for (let item2 of this.addToSerchIds) {
        if (item1._id === item2._id) {
          this.addToSerchIds.splice(i, 1);
        }
        i++;
      }
    }
    if (this.isCandidateAdd === false) {
      this.candidates = this.candidates.concat(this.addToSerchIds);
    }debugger
    this.latestSearchResultCount.emit(this.candidates.length);


    this.isCandidateAdd = false;

  }

  ngOnInit() {
    //this.candidates2 = this.candidate2;
    this.matchFormat = this.match.aboveMatch
  }

  clearFilter() {
    this.filterService.clearFilter();
  }

  addToShortList(selectedCandidate: any) {
    this.qCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, selectedCandidate._id, ValueConstant.SHORT_LISTED_CANDIDATE, "add").subscribe(
      user => {
        console.log(user);
      });
    if (selectedCandidate.isCandidateshortListed != true) {
      selectedCandidate.isCandidateshortListed = true;
    }
    else {
      selectedCandidate.isCandidateshortListed = false
    }

    this.updatedIdsModel.updatedCandidateInShortlistId = selectedCandidate._id;
    this.updatedIds.emit(this.updatedIdsModel);
    this.updatedIdsModel = new UpdatedIds();
    /*this.shortlisted = !this.shortlisted;*/
    let i = 0;
    for (let item of this.candidates) {

      if (item._id === selectedCandidate._id) {
        this.candidates.splice(i, 1);
      }
      i++;
    }

  }

  matchedCandidate() {
    this.showQCardView();
    this.showMatchedCandidateButton = false;
  }

  showQCardView() {
    this.isShowQCardView = true;
    this.qCardViewService.getSearchedcandidate(this.jobPosterModel)
      .subscribe(
        data => {
          this.candidates = data;
          console.log('q card data', this.candidates);
          this.matches = this.candidates.length
        });
    for (let readedCandidate of this.candidateSeenIDS) {
      for (let searchedCandidate of this.candidates) {
        if (searchedCandidate._id === readedCandidate)
          searchedCandidate.isCandidateRead = true;
      }
    }


  }

  Reject(item: any) {
    this.showModalStyle = !this.showModalStyle;
  }

  addToCart(_id: any) {
    this.showModalStyle = false;

    this.qCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, _id, ValueConstant.CART_LISTED_CANDIDATE, "add").subscribe(
      user => {
        console.log(user);
      });
    this.updatedIdsModel.updatedCandidateIncartId = _id;
    this.updatedIds.emit(this.updatedIdsModel);
    this.updatedIdsModel = new UpdatedIds();
    let i = 0;
    for (let item of this.candidates) {

      if (item._id === _id) {
        this.candidates.splice(i, 1);
      }
      i++;
    }


  }


  viewProfile(candidateid: string) {
    this.profileCreatorService.getCandidateDetailsOfParticularId(candidateid).subscribe(
      candidateData => this.OnCandidateDataSuccess(candidateData));

  }

  OnCandidateDataSuccess(candidate: any) {
    this.selectedCandidate = candidate.data;
    this.candidateDetails = candidate.metadata;
    this.showModalStyle = !this.showModalStyle;

//    this.candidateDetails = candidateData.metadata;
  }

  getStyleModal() {//TODO remove this from all model
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

  sortBy() {
    this.toggleFormat();
  }

  toggleFormat() {
    this.toggle = true;
  }

  matching(value: any) {
    this.matchFormat = value;
  }
}
