import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {JobDashboardService} from "./job-dashboard.service";
import {RecruiterJobView} from "../../model/recruiter-job-view";
import {ValueConstant, Tooltip} from "../../../../shared/constants";
import {CandidateQListModel} from "./q-cards-candidates";
import {JobPosterModel} from "../../model/jobPoster";
import {ReferenceService} from "../../model/newClass";
import {QCardFilterService} from "../../filters/q-card-filter.service";
import {QCardFilter} from "../../model/q-card-filter";
import {LoaderService} from "../../../../shared/loader/loaders.service";
import {ProfileComparisonService} from "../../profile-comparison/profile-comparison.service";
import {ProfileComparison} from "../../model/profile-comparison";
import {QCardviewComponent} from "../q-card-view/q-card-view.component";
import {ErrorService} from "../../error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-job-dashboard',
  templateUrl: 'job-dashboard.component.html',
  styleUrls: ['job-dashboard.component.css']

 })

export class JobDashboardComponent implements OnInit {

  jobId: any;
  jobCount: any;
  private recruiterId: string;
  private showModalStyle: boolean = false;
  private headerInfo: any;
  private recruiterJobView: RecruiterJobView = new RecruiterJobView();
  private whichListVisible: boolean[] = new Array(4);
  private candidateQlist: CandidateQListModel = new CandidateQListModel();
  private selectedJobProfile: JobPosterModel = new JobPosterModel();
  private filterMeta: QCardFilter;
  private isRecruitingForSelf: boolean;
  private profileComparison: ProfileComparison;
  private listOfCandidateIdToCompare: string[] = new Array(0);
  private emptyListMessage: string = Tooltip.EMPTY_LIST_MESSAGE;
  private emptyCartMessage: string = Tooltip.EMPTY_CART_MESSAGE;
  private emptyRejectedList: string = Tooltip.EMPTY_REJECTED_LIST_MESSAGE;
  @ViewChild(QCardviewComponent) acaQcardClassObject: QCardviewComponent;


  constructor(public refrence: ReferenceService,
              private activatedRoute: ActivatedRoute,
              private errorService: ErrorService,
              private jobDashboardService: JobDashboardService,
              private _router:Router,private qcardFilterService:QCardFilterService,
              private loaderService: LoaderService,private profileComparisonService: ProfileComparisonService) {
    this.qcardFilterService.candidateFilterValue$.subscribe(
      (data: QCardFilter) => {
        this.filterMeta = data;
      }
    );

  }

  ngOnInit() {
    this.headerInfo = this.refrence.data;
    this.jobCount = this.headerInfo.numberOfJobposted;

    this.activatedRoute.params.subscribe(params => {
      this.jobId = params['jobId'];
    });

    this.getJobProfile();
    this.whichListVisible = new Array(5);
    this.getMatchingProfiles();

  }

  getJobProfile() {
    this.jobDashboardService.getPostedJobDetails(this.jobId)
      .subscribe(
        (data: any) => {
          this.isRecruitingForSelf = data.data.industry.isRecruitingForself;
          this.selectedJobProfile = data.data.industry.postedJobs[0];
          this.recruiterId = data.data.industry._id;
          for (let item of data.data.industry.postedJobs[0].candidate_list) {
            if (item.name === ValueConstant.APPLIED_CANDIDATE)
              this.recruiterJobView.numberOfCandidatesApplied = item.ids.length;
            if (item.name === ValueConstant.CART_LISTED_CANDIDATE)
              this.recruiterJobView.numberOfCandidatesInCart = item.ids.length;
            if (item.name === ValueConstant.REJECTED_LISTED_CANDIDATE)
              this.recruiterJobView.numberOfCandidatesrejected = item.ids.length;
          }
        },error => this.errorService.onError(error));
  }

  getMatchingProfiles() {
   /* this.qcardFilterService.clearFilter();*/
    for (let i = 0; i < this.whichListVisible.length; i++) {
      this.whichListVisible[i] = false;
    }
    this.whichListVisible[0] = true;
    if(this.candidateQlist.matchedCandidates.length>0){
      return;
    }
    this.jobDashboardService.getSearchedcandidate(this.jobId)
      .subscribe(
        (data: any) => {
          this.jobDashboardService.getSelectedListData(this.jobId, ValueConstant.SHORT_LISTED_CANDIDATE)
            .subscribe(
              (listdata: any) => {
                this.loaderService.stop();
                this.recruiterJobView.numberOfMatchedCandidates = data.length;
                let temp = new CandidateQListModel();
                temp.shortListedCandidates = listdata.data;
                temp.matchedCandidates = data;
                this.candidateQlist = temp;
              },error => this.errorService.onError(error));
        },error => this.errorService.onError(error));
  }

  AddedToCart(event: any) {
    if (event === true)
      this.headerInfo.totalNumberOfCandidateInCart += 1;
    if (event === false)
      this.headerInfo.totalNumberOfCandidateInCart -= 1;
  }


  getSelectedListData(listName: string) {

   /* this.qcardFilterService.clearFilter();*/
    for (let i = 0; i < this.whichListVisible.length; i++) {
      this.whichListVisible[i] = false;
    }
    switch (listName) {
      case ValueConstant.CART_LISTED_CANDIDATE :
        if(this.candidateQlist.cartCandidates.length>0) {
          this.whichListVisible[1] = true;
          return;
        }
        break;
      case ValueConstant.REJECTED_LISTED_CANDIDATE :
        if(this.candidateQlist.rejectedCandidates.length>0) {
          this.whichListVisible[3] = true;
          return;
        }
        break;
      case ValueConstant.SHORT_LISTED_CANDIDATE :
        if(this.candidateQlist.shortListedCandidates.length>0) {
          return;
        }
        break;
      case ValueConstant.APPLIED_CANDIDATE :
        if(this.candidateQlist.appliedCandidates.length>0) {
          this.whichListVisible[2] = true;
          return;
        }
        break;
    }
    this.jobDashboardService.getSelectedListData(this.jobId, listName)
      .subscribe(
        (data: any) => {
          switch (listName) {
            case ValueConstant.CART_LISTED_CANDIDATE :
              this.candidateQlist.cartCandidates = data.data;
              this.whichListVisible[1] = true;
              break;
            case ValueConstant.REJECTED_LISTED_CANDIDATE :
              this.candidateQlist.rejectedCandidates = data.data;
              this.whichListVisible[3] = true;
              break;
            case ValueConstant.SHORT_LISTED_CANDIDATE :
              this.candidateQlist.shortListedCandidates = data.data;
              break;
            case ValueConstant.APPLIED_CANDIDATE :
              this.candidateQlist.appliedCandidates = data.data;
              this.whichListVisible[2] = true;
              break;
          }
        },error => this.errorService.onError(error));
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

  performActionOnComparisonList(data:any) {
    //console.log('---------------candidateQlistcandidateQlistcandidateQlist--------------------------',this.candidateQlist);
    if (data.action == 'Remove') {
      this.profileComparison.profileComparisonData.splice(this.profileComparison.profileComparisonData.indexOf(data.item), 1);
      this.listOfCandidateIdToCompare.splice(this.profileComparison.profileComparisonData.indexOf(data.item._id), 1);
      this.recruiterJobView.numberOfCandidatesInCompare--;
    } else if (data.action == 'AddToCart') {
      //matchedList cartListed applied rejectedList
      var compareAction:any;

      if (this.candidateQlist.matchedCandidates.filter(function (obj) {
          return data.item._id == obj._id;
        }).length && (data.item.candidateListStatus.indexOf('applied') !== -1)) {
        compareAction = {'action': 'add', 'source': 'matchedList', 'destination': 'cartListed', 'id': data.item._id};
      } else if (this.candidateQlist.matchedCandidates.filter(function (obj) {
          return data.item._id == obj._id;
        }).length) {
        compareAction = {'action': 'add', 'source': 'matchedList', 'destination': 'cartListed', 'id': data.item._id};
      } else if (this.candidateQlist.appliedCandidates.filter(function (obj) {
          return data.item._id == obj._id;
        }).length) {
        compareAction = {'action': 'add', 'source': 'applied', 'destination': 'cartListed', 'id': data.item._id};
      }

      this.profileComparison.profileComparisonData.splice(this.profileComparison.profileComparisonData.indexOf(data.item), 1);
      this.listOfCandidateIdToCompare.splice(this.profileComparison.profileComparisonData.indexOf(data.item._id), 1);
      this.recruiterJobView.numberOfCandidatesInCompare--;
      //this.profileCompareService.change(compareAction);
      this.acaQcardClassObject.actionOnQCardFromParent(compareAction);

    } else if (data.action == 'Reject') {
      var compareAction:any;
      if (this.candidateQlist.matchedCandidates.filter(function (obj) {
          return data.item._id == obj._id
        }).length && (data.item.candidateListStatus.indexOf('applied') !== -1)) {
        compareAction = {'action': 'add', 'source': 'matchedList', 'destination': 'rejectedList', 'id': data.item._id};
      } else if (this.candidateQlist.matchedCandidates.filter(function (obj) {
          return data.item._id == obj._id
        }).length) {
        compareAction = {'action': 'add', 'source': 'matchedList', 'destination': 'rejectedList', 'id': data.item._id};
      } else if ((data.item.candidateListStatus.indexOf('cartListed') !== -1) && (data.item.candidateListStatus.indexOf('applied') == -1)) {
        compareAction = {'action': 'add', 'source': 'cartListed', 'destination': 'rejectedList', 'id': data.item._id};
      } else if ((data.item.candidateListStatus.indexOf('applied') !== -1) && (data.item.candidateListStatus.indexOf('cartListed') == -1)) {
        compareAction = {'action': 'add', 'source': 'applied', 'destination': 'rejectedList', 'id': data.item._id};
      } else if ((data.item.candidateListStatus.indexOf('cartListed') !== -1) && (data.item.candidateListStatus.indexOf('applied') !== -1)) {
        compareAction = {'action': 'add', 'source': 'cartListed', 'destination': 'rejectedList', 'id': data.item._id};
      }

      this.profileComparison.profileComparisonData.splice(this.profileComparison.profileComparisonData.indexOf(data.item), 1);
      this.listOfCandidateIdToCompare.splice(this.profileComparison.profileComparisonData.indexOf(data.item._id), 1);
      this.recruiterJobView.numberOfCandidatesInCompare--;
      this.acaQcardClassObject.actionOnQCardFromParent(compareAction);
    }
  }


  getCompareDetail() {
    this.whichListVisible[4] = true;
    if (this.listOfCandidateIdToCompare.length) {
      this.profileComparisonService.getCompareDetail(this.listOfCandidateIdToCompare, this.jobId)
        .subscribe(
          data => this.OnCompareSuccess(data.data)
          ,error => this.errorService.onError(error));
    }
  }

  OnCompareSuccess(data: ProfileComparison) {
    this.profileComparison = data;
  }

  addForCompare(obj: any) {

    this.jobDashboardService.addUsesTrackingData(this.recruiterId, this.jobId, obj.id, 'add').subscribe(
      data => {
      }
      , error => this.errorService.onError(error));
    if (this.listOfCandidateIdToCompare.indexOf(obj.id) == -1) {
      //this.listOfCandidateStatus.push(obj);
      this.listOfCandidateIdToCompare.push(obj.id);
      this.recruiterJobView.numberOfCandidatesInCompare++;
    }
  }

}
