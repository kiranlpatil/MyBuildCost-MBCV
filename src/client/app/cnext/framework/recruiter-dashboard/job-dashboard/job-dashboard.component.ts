import {Component, OnInit, ViewChild, ElementRef, OnChanges} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobDashboardService } from './job-dashboard.service';
import { RecruiterJobView } from '../../model/recruiter-job-view';
import { ValueConstant, Tooltip, UsageActions } from '../../../../shared/constants';
import { CandidateQListModel } from './q-cards-candidates';
import { JobPosterModel } from '../../../../user/models/jobPoster';
import { QCardFilterService } from '../../filters/q-card-filter.service';
import { QCardFilter } from '../../model/q-card-filter';
import { LoaderService } from '../../../../shared/loader/loaders.service';
import { ProfileComparisonService } from '../../profile-comparison/profile-comparison.service';
import { ProfileComparison } from '../../model/profile-comparison';
import { QCardviewComponent } from '../q-card-view/q-card-view.component';
import { ErrorService } from '../../../../shared/services/error.service';
import { Label } from '../../../../shared/constants';
import { UsageTrackingService } from '../../usage-tracking.service';
import { JobPosterService } from '../../job-poster/job-poster.service';
import { MessageService } from '../../../../shared/services/message.service';
import { RenewJobPostService } from '../../../../user/services/renew-jobpost.service';
import { Message } from '../../../../shared/models/message';
import {ESort} from "../../model/sort-type";
import {EList} from "../../model/list-type";
import {RecruiterHeaderDetails} from "../../model/recuirterheaderdetails";
import {ActionOnQCardService} from "../../../../user/services/action-on-q-card.service";
import {UsageTracking} from "../../model/usage-tracking";
@Component({
  moduleId: module.id,
  selector: 'cn-job-dashboard',
  templateUrl: 'job-dashboard.component.html',
  styleUrls: ['job-dashboard.component.css']

 })

export class JobDashboardComponent implements OnInit, OnChanges {

  jobId: any;
  jobCount: any;
  headerInfo: RecruiterHeaderDetails;
  recruiterJobView: RecruiterJobView = new RecruiterJobView();
  whichListVisible: boolean[] = new Array(4);
  selectedJobId: string;
  selectedJobTitle: string;
  isCloneButtonClicked: boolean;
  selectedJobProfile: JobPosterModel = new JobPosterModel();
  sortBy : ESort = ESort.BEST_MATCH;
  listName : EList = EList.CAN_MATCHED;
  @ViewChild(QCardviewComponent) acaQcardClassObject: QCardviewComponent;
  private candidateQlist: CandidateQListModel = new CandidateQListModel();
  private recruiterId: string;
  private showModalStyle: boolean = false;
  private filterMeta: QCardFilter;
  private appliedFilters :QCardFilter = new QCardFilter();
  private isRecruitingForSelf: boolean;
  private addedToCart: boolean;
  private profileComparison: ProfileComparison;
  private listOfCandidateIdToCompare: string[] = new Array(0);
  private emptyListMessage: string = Tooltip.EMPTY_LIST_MESSAGE;
  private emptyCartMessage: string = Tooltip.EMPTY_CART_MESSAGE;
  private emptyRejectedList: string = Tooltip.EMPTY_REJECTED_LIST_MESSAGE;
  isJobCloseButtonClicked:boolean;
  addForCompareView: any;


  constructor(private activatedRoute: ActivatedRoute,
              private errorService: ErrorService,
              private jobDashboardService: JobDashboardService,
              private usageTracking : UsageTrackingService,
              private _router:Router,private qcardFilterService:QCardFilterService,
              private loaderService: LoaderService,private profileComparisonService: ProfileComparisonService,
              private renewJobPostService: RenewJobPostService, private messageService: MessageService,
              private actionOnQCardService: ActionOnQCardService) {
    this.qcardFilterService.candidateFilterValue$.subscribe(
      (data: QCardFilter) => {
        this.filterMeta = data;
      }
    );
    this.headerInfo = new RecruiterHeaderDetails();
    this.actionOnQCardService.getValueForCompareView().subscribe(addForCompareView => {this.addForCompareView = addForCompareView;
    this.addForCompare(addForCompareView);
    });
  }

  ngOnInit() {
    this.jobCount = this.headerInfo.numberOfJobposted;

    this.activatedRoute.params.subscribe(params => {
      this.jobId = params['jobId'];
    });
    this.getActionOnViewProfile();
    this.getJobProfile();
    this.whichListVisible = new Array(5);
    this.getAction();
  }

  ngOnChanges(changes: any) {
  }

  getJobProfile() {
    this.jobDashboardService.getPostedJobDetails(this.jobId)
      .subscribe(
        (data: any) => {
          this.isRecruitingForSelf = data.result.recruiterId.isRecruitingForself;
          this.selectedJobProfile = data.result;
          this.recruiterId = data.result.recruiterId._id;
          this.getMatchingProfiles();
          this.renewJobPostService.checkJobPostExpiryDate(this.selectedJobProfile);
          for (let item of this.selectedJobProfile.candidate_list) {
            if (item.name === ValueConstant.APPLIED_CANDIDATE)
              this.recruiterJobView.numberOfCandidatesApplied = item.ids.length;
            if (item.name === ValueConstant.CART_LISTED_CANDIDATE)
              this.recruiterJobView.numberOfCandidatesInCart = item.ids.length;
            if (item.name === ValueConstant.REJECTED_LISTED_CANDIDATE)
              this.recruiterJobView.numberOfCandidatesrejected = item.ids.length;
          }
        }, error => this.errorService.onError(error));
  }

  getMatchingProfiles() {
    /* this.qcardFilterService.clearFilter();*/
   /*this.listName = ValueConstant.MATCHED_CANDIDATE*/
    this.listName = EList.CAN_MATCHED;
    for (let i = 0; i < this.whichListVisible.length; i++) {
      this.whichListVisible[i] = false;
    }
    this.whichListVisible[0] = true;
    if (this.candidateQlist.matchedCandidates.length > 0) {
      return;
    }
    this.appliedFilters = new QCardFilter();
    this.appliedFilters.sortBy = this.sortBy;
    this.appliedFilters.listName = this.listName;
    this.appliedFilters.proficiencies = this.selectedJobProfile.proficiencies;
    this.jobDashboardService.getSearchedcandidate(this.jobId, this.appliedFilters)
      .subscribe(
        (data: any) => {
          this.jobDashboardService.getSelectedListData(this.jobId, EList.CAN_SHORT_LIST, this.appliedFilters)
            .subscribe(
              (listdata: any) => {
                this.loaderService.stop();
                this.recruiterJobView.numberOfMatchedCandidates = data.length;
                let temp = new CandidateQListModel();
                temp.shortListedCandidates = listdata.data;
                temp.matchedCandidates = data;
                this.candidateQlist = temp;
              }, error => this.errorService.onError(error));
        }, error => this.errorService.onError(error));
    window.scrollTo(0, 0);
  }

  AddedToCart(event: any) {
    if (event === true)
      this.headerInfo.totalNumberOfCandidateInCart += 1;
    if (event === false)
      this.headerInfo.totalNumberOfCandidateInCart -= 1;
  }


  getSelectedListData(listName: EList, isFromFilter: boolean) {

    /* this.qcardFilterService.clearFilter();*/
    for (let i = 0; i < this.whichListVisible.length; i++) {
      this.whichListVisible[i] = false;
    }
    this.listName = listName;
    switch (listName) {
      case EList.CAN_CART :
        if (this.candidateQlist.cartCandidates.length > 0) {
          this.whichListVisible[1] = true;
          if (!isFromFilter) {
            return;
          }
        }
        break;
      case EList.CAN_REJECTED :
        if (this.candidateQlist.rejectedCandidates.length > 0) {
          this.whichListVisible[3] = true;
          if (!isFromFilter) {
            return;
          }
        }
        break;
      case EList.CAN_SHORT_LIST :
        if (this.candidateQlist.shortListedCandidates.length > 0) {
          if (!isFromFilter) {
            return;
          }
        }
        break;
      case EList.CAN_APPLIED :
        if (this.candidateQlist.appliedCandidates.length > 0) {
          this.whichListVisible[2] = true;
          if (!isFromFilter) {
            return;
          }
        }
        break;
    }
    this.jobDashboardService.getSelectedListData(this.jobId, this.listName, this.appliedFilters)
      .subscribe(
        (data: any) => {
          switch (this.listName) {
            case EList.CAN_CART :
              this.candidateQlist.cartCandidates = data;
              this.recruiterJobView.numberOfCandidatesInCart = this.candidateQlist.cartCandidates.length;
              this.whichListVisible[1] = true;
              break;
            case EList.CAN_REJECTED :
              this.candidateQlist.rejectedCandidates = data;
              this.recruiterJobView.numberOfCandidatesrejected = this.candidateQlist.rejectedCandidates.length;
              this.whichListVisible[3] = true;
              break;
            case EList.CAN_SHORT_LIST :
              this.candidateQlist.shortListedCandidates = data;
              break;
            case EList.CAN_APPLIED :
              this.candidateQlist.appliedCandidates = data;
              this.recruiterJobView.numberOfCandidatesApplied = this.candidateQlist.appliedCandidates.length;
              this.whichListVisible[2] = true;
              break;
          }
        }, error => this.errorService.onError(error));
    window.scrollTo(0, 0);
  }

  navigateTo(navigateTo: string, item: string) {
    if (navigateTo !== undefined) {
      if (item) {
        this._router.navigate([navigateTo, item]);
      } else {
        this._router.navigate([navigateTo]);
      }
    }
  }

  viewJobDetails() {
    this.showModalStyle = true;
  }

  getModal() {//TODO remove this from all model
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

  closeJob() {
    this.showModalStyle = !this.showModalStyle;
  }

//TODO: move this (performActionOnComparisonList) code to comaprison compoent  ->by krishna ghatul code refactor
  performActionOnComparisonList(data: any) {
    let usageTrackingData: UsageTracking = new UsageTracking();
    var compareAction: any;
    if (data.action == 'Remove') {
      this.profileComparison.profileComparisonData.splice(this.profileComparison.profileComparisonData.indexOf(data.item), 1);
      this.listOfCandidateIdToCompare.splice(this.profileComparison.profileComparisonData.indexOf(data.item._id), 1);
      this.recruiterJobView.numberOfCandidatesInCompare--;
      usageTrackingData.recruiterId = this.recruiterId;
      usageTrackingData.action = UsageActions.REMOVED_FROM_COMPARE_VIEW_BY_RECRUITER;
      usageTrackingData.jobProfileId = this.jobId;
      usageTrackingData.candidateId = data.item._id;
      this.usageTracking.addUsesTrackingData(usageTrackingData).subscribe(
        data => {
          console.log('' + data);
        }, error => this.errorService.onError(error));
    } else if (data.action == 'AddToCart') {
      //matchedList cartListed applied rejectedList
     // var compareAction: any;

      if (this.candidateQlist.matchedCandidates.filter(function (obj) {
          return data.item._id == obj._id;
        }).length && (data.item.candidateListStatus.indexOf('applied') !== -1)) {
        compareAction = {'action': 'add', 'destination': 'cartListed', 'id': data.item._id};
      } else if (this.candidateQlist.matchedCandidates.filter(function (obj) {
          return data.item._id == obj._id;
        }).length) {
        compareAction = {'action': 'add', 'destination': 'cartListed', 'id': data.item._id};
      } else if (this.candidateQlist.appliedCandidates.filter(function (obj) {
          return data.item._id == obj._id;
        }).length) {
        compareAction = {'action': 'add', 'destination': 'cartListed', 'id': data.item._id};
      }

      this.profileComparison.profileComparisonData.splice(this.profileComparison.profileComparisonData.indexOf(data.item), 1);
      this.listOfCandidateIdToCompare.splice(this.profileComparison.profileComparisonData.indexOf(data.item._id), 1);
      this.recruiterJobView.numberOfCandidatesInCompare--;
      //this.profileCompareService.change(compareAction);
     this.acaQcardClassObject.actionOnQCardFromParent(compareAction);

    } else if (data.action == 'Reject') {
     // var compareAction: any;
      if (this.candidateQlist.matchedCandidates.filter(function (obj) {
          return data.item._id == obj._id;
        }).length && (data.item.candidateListStatus.indexOf('applied') !== -1)) {
        compareAction = {'action': 'add', 'destination': 'rejectedList', 'id': data.item._id};
      } else if (this.candidateQlist.matchedCandidates.filter(function (obj) {
          return data.item._id == obj._id;
        }).length) {
        compareAction = {'action': 'add', 'destination': 'rejectedList', 'id': data.item._id};
      } else if ((data.item.candidateListStatus.indexOf('cartListed') !== -1) && (data.item.candidateListStatus.indexOf('applied') == -1)) {
          compareAction = {'action': 'add', 'destination': 'rejectedList', 'id': data.item._id};
      } else if ((data.item.candidateListStatus.indexOf('applied') !== -1) && (data.item.candidateListStatus.indexOf('cartListed') == -1)) {
        compareAction = {'action': 'add', 'destination': 'rejectedList', 'id': data.item._id};
      } else if ((data.item.candidateListStatus.indexOf('cartListed') !== -1) && (data.item.candidateListStatus.indexOf('applied') !== -1)) {
         compareAction = {'action': 'add', 'destination': 'rejectedList', 'id': data.item._id};
      }

      this.profileComparison.profileComparisonData.splice(this.profileComparison.profileComparisonData.indexOf(data.item), 1);
      this.listOfCandidateIdToCompare.splice(this.profileComparison.profileComparisonData.indexOf(data.item._id), 1);
      this.recruiterJobView.numberOfCandidatesInCompare--;
      this.acaQcardClassObject.actionOnQCardFromParent(compareAction);
    }
  }

  changeSorting(sortBy: ESort) {
    this.appliedFilters.sortBy = sortBy;
    if (EList.CAN_MATCHED === this.listName) {
      this.getCandidatesWithSort();
    } else {
      this.getSelectedListData(this.listName, true);
    }
  }

  changeFilter(obj: QCardFilter) {
    this.appliedFilters = obj;
    if (EList.CAN_MATCHED === this.listName) {
      this.getCandidatesWithSort();
    } else {
      this.getSelectedListData(this.listName, true);
    }
  }

  getCandidatesWithSort() {
    this.jobDashboardService.getSearchedcandidate(this.jobId, this.appliedFilters)
      .subscribe(
        (data: any) => {
          this.jobDashboardService.getSelectedListData(this.jobId, EList.CAN_SHORT_LIST, this.appliedFilters)
            .subscribe(
              (listdata: any) => {
                this.loaderService.stop();
                this.recruiterJobView.numberOfMatchedCandidates = data.length;
                let temp = new CandidateQListModel();
                temp.shortListedCandidates = listdata.data;
                temp.matchedCandidates = data;
                this.candidateQlist = temp;
              }, error => this.errorService.onError(error));
        }, error => this.errorService.onError(error));
    window.scrollTo(0, 0);
  }

  getCompareDetail() {
    this.whichListVisible[4] = true;
    if (this.listOfCandidateIdToCompare.length) {
      this.profileComparisonService.getCompareDetail(this.listOfCandidateIdToCompare, this.jobId)
        .subscribe(
          data => this.OnCompareSuccess(data.data)
          , error => this.errorService.onError(error));
    }
    window.scrollTo(0, 0);
  }

  OnCompareSuccess(data: ProfileComparison) {
    this.profileComparison = data;
  }

  addForCompare(obj: any) {
    let usageTrackingData: UsageTracking = new UsageTracking();
    usageTrackingData.recruiterId = this.recruiterId;
    usageTrackingData.action = UsageActions.ADDED_IN_TO_COMPARE_VIEW_BY_RECRUITER;
    usageTrackingData.jobProfileId = this.jobId;
    usageTrackingData.candidateId = obj.id;
    this.usageTracking.addUsesTrackingData(usageTrackingData).subscribe(
      data => {
        console.log('' + data);
      }, error => this.errorService.onError(error));
    if (this.listOfCandidateIdToCompare.indexOf(obj.id) === -1) {
      this.listOfCandidateIdToCompare.push(obj.id);
      this.recruiterJobView.numberOfCandidatesInCompare++;
    }
  }

  raiseCloneEvent() {
    this.selectedJobId = this.selectedJobProfile._id;
    this.selectedJobTitle = this.selectedJobProfile.jobTitle;
    this.isCloneButtonClicked = !this.isCloneButtonClicked;
  }

  jobcloned(event: any) {
    this._router.navigate(['/recruiter/jobpost', event]);
  }

  getLabel() {
    return Label;
  }


  onRenewJob() {
    this.renewJobPostService.onRenewJob(this.selectedJobProfile);
  }

  updateJob() {
    this.renewJobPostService.updateJob();
  }

  closeJobPost(selectedJobProfile: any) {
    console.log('isJob posted = ', selectedJobProfile.isJobPosted);
    this.selectedJobProfile = selectedJobProfile;
    this.selectedJobTitle = selectedJobProfile.jobTitle;
    this.isJobCloseButtonClicked = !this.isJobCloseButtonClicked;
  }

  getAction() {
    this.actionOnQCardService.getAction().subscribe(actionOnValuePortrait => {
      this.acaQcardClassObject.actionOnQCardFromParent(actionOnValuePortrait);
    });
  }

  getActionOnViewProfile() {
    this.actionOnQCardService.getActionOnViewProfile().subscribe(actionOnViewProfile => {
      this.acaQcardClassObject.viewProfileFromParent(actionOnViewProfile);
    });
  }
}
