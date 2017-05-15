import {Component, Input, OnChanges, OnInit} from "@angular/core";
import {CandidateQCard} from "../model/candidateQcard";
import {ShowQcardviewService} from "../showQCard.service";
import {QCardViewService} from "./q-card-view.service";
import {JobPosterModel} from "../model/jobPoster";
import {QCardsortBy} from "../model/q-cardview-sortby";
import {CandidateFilter} from "../model/candidate-filter";
import {CandidateFilterService} from "../filters/candidate-filter.service";
import {ValueConstant} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-q-card-view',
  templateUrl: 'q-card-view.component.html',
  styleUrls: ['q-card-view.component.css'],

})
export class QCardviewComponent implements OnInit, OnChanges {
  private candidates: CandidateQCard[] = new Array();
  private allCandidates:CandidateQCard[] = new Array();
  private selectedPerson: CandidateQCard = new CandidateQCard();
  private showMatchedCandidateButton: boolean;
  private candidateSeenIDS = new Array();
  private toggle: boolean = false;
  private matches: number;
  private qCardModel: QCardsortBy = new QCardsortBy();
  private isShowQCardView: boolean;
  private candidateFilter: CandidateFilter;
  @Input() private jobPosterModel: JobPosterModel;
  @Input() private recruiterId: string;
  private shortlisted: boolean = false;

  constructor(private qCardViewService: QCardViewService, private showQCardview: ShowQcardviewService, private candidateFilterService: CandidateFilterService) {
    this.showQCardview.showJobQCardView$.subscribe(
      data => {
        this.jobPosterModel = data;
        this.showQCardView();
      }
    );
    this.candidateFilterService.candidateFilterValue$.subscribe(
      (data: CandidateFilter) => {
        this.candidateFilter = data;
        console.log('filter data', this.candidateFilter);
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
  }

  ngOnInit() {
    //this.candidates2 = this.candidate2;
  }

  addToShortList(_id: any) {
    this.qCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, _id, ValueConstant.SHORT_LISTED_CANDIDATE, "add").subscribe(
      user => {
        console.log(user);
      });
    this.shortlisted = !this.shortlisted;
   /* let i=0;
    for(let item of this.candidates){

      if(item._id ===_id){
        this.candidates.splice(i,1);
      }
      i++;
    }
    this.matches=this.candidates.length;*/
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
          this.candidates = data,
            this.matches = this.candidates.length
        });
    for (let readedCandidate of this.candidateSeenIDS) {
      for (let searchedCandidate of this.candidates) {
        if (searchedCandidate._id === readedCandidate)
          searchedCandidate.isCandidateRead = true;
      }
    }
  }

  addToCart(_id: any) {
    this.qCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, _id, ValueConstant.CART_LISTED_CANDIDATE, "add").subscribe(
      user => {
        console.log(user);
      });
    let i=0;
    for(let item of this.candidates){

      if(item._id ===_id){
        this.candidates.splice(i,1);
      }
      i++;
    }
    this.matches=this.candidates.length;
  }

  sortBy() {
    this.toggleFormat();
  }

  /*get formatcandidate() {
   return this.toggle ? this.qCardModel.name : "JobMatching";
   }
   */
  toggleFormat() {
    this.toggle = true;
  }

  /*candidate2 =[
   {
   "_id": "1",
   "first_name" : "krishna",
   "last_name" : "ghatul",
   "matching" : 100,
   "salary": "3 Lakhs",
   "experience": "2 year",
   "education": "Post Graduate",
   "location":"Mumbai",
   "proficiencies":["ABC"],
   "noticePeriod":"Within 1 month",
   "interestedIndustries":["OTHER"],

   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140
   },
   {
   "_id": "2",
   "first_name" : "Tom",
   "last_name" : "ghatul",
   "matching" : 100,
   "salary": "1 Lakhs",
   "experience": "5 year",
   "education": "Under Graduate",
   "location":"Delhi",
   "proficiencies":["ABC","JAVA"],
   "noticePeriod":"Immediate",
   "interestedIndustries":["MNC","IT","GK","OTHER"],

   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140

   },
   {
   "_id": "3",
   "first_name" : "Ram",
   "last_name" : "ghatul",
   "matching" : 100,
   "salary": "3 Lakhs",
   "experience": "9 year",
   "education": "Graduate",
   "location":"Masco",
   "proficiencies":["JAVA"],
   "noticePeriod":"Within 1 month",
   "interestedIndustries":["MNC","IT","GK"],
   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140

   },
   {
   "_id": "4",
   "first_name" : "JAY",
   "last_name" : "ROY",
   "matching" : 100,
   "salary": "4 Lakhs",
   "experience": "4 year",
   "education": "Post Graduate",
   "location":"pune",
   "proficiencies":["ABC","JAVA","Bertrand"],
   "noticePeriod":"1-2 Month",
   "interestedIndustries":["MNC","IT","PK"],
   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140

   },
   {
   "_id": "5",
   "first_name" : "Narendra",
   "last_name" : "Modi",
   "matching" : 100,
   "salary": "5 Lakhs",
   "experience": "3 year",
   "education": "Post Graduate",
   "location":"pune",
   "proficiencies":["Bertrand"],
   "noticePeriod":"2-3 Month",
   "interestedIndustries":["MNC","PK"],
   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140

   },
   {
   "_id": "6",
   "first_name" : "Akshay",
   "last_name" : "Kumar",
   "matching" : 100,
   "salary": "6 Lakhs",
   "experience": "8 year",
   "education": "Graduate",
   "location":"pune",
   "proficiencies":["ABC","JAVA","ABSET","Bertrand"],
   "noticePeriod":"Beyond 3 months",
   "interestedIndustries":["MNC"],
   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140

   },
   {
   "_id": "7",
   "first_name" : "Mr:xyz",
   "last_name" : "Abcsa",
   "matching" : 100,
   "salary": "7 Lakhs",
   "experience": "1 year",
   "education": "Under Graduate",
   "location":"pune",
   "proficiencies":["ABC"],
   "noticePeriod":"Beyond 3 months",
   "interestedIndustries":["MNC","IT","PK"],
   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140

   }
   ]*/
}
