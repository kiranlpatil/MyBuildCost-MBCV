import {Component, Input, OnChanges, OnInit, Output, EventEmitter} from "@angular/core";
import {CandidateQCard} from "../model/candidateQcard";
import {ShowQcardviewService} from "../showQCard.service";
import {QCardViewService} from "./q-card-view.service";
import {JobPosterModel} from "../model/jobPoster";
import {QCardsortBy} from "../model/q-cardview-sortby";
import {CandidateFilter} from "../model/candidate-filter";
import {CandidateFilterService} from "../filters/candidate-filter.service";
import {ValueConstant} from "../../../framework/shared/constants";
import {UpdatedIds} from "../model/updatedCandidatesIDS";

@Component({
  moduleId: module.id,
  selector: 'cn-q-card-view',
  templateUrl: 'q-card-view.component.html',
  styleUrls: ['q-card-view.component.css'],

})
export class QCardviewComponent implements OnInit, OnChanges {
  @Output() updatedIds= new EventEmitter<UpdatedIds>();

  private candidates: CandidateQCard[] = new Array();
  private candidates2:any[] = new Array();
  private selectedPerson: CandidateQCard = new CandidateQCard();
  private showMatchedCandidateButton: boolean;
  private candidateSeenIDS = new Array();
  private candidateshortlisted = new Array();
  private updatedIdsModel:UpdatedIds=new UpdatedIds() ;
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
      /*if (changes.jobPosterModel.currentValue.candidate_list.length != 0) {
        for (let item of changes.jobPosterModel.currentValue.candidate_list) {
          if (item.name == "shortListed") {
            this.candidateshortlisted.push(item.ids);
          }

        }
      }*/
    }}
  ngOnInit() {
   // this.candidates2 = this.candidate2;
  }
  clearFilter() {
    this.candidateFilterService.clearFilter();
  }
  addToShortList(selectedCandidate: any) {
    this.qCardViewService.addCandidateLists(this.recruiterId, this.jobPosterModel._id, selectedCandidate._id, ValueConstant.SHORT_LISTED_CANDIDATE, "add").subscribe(
      user => {
        console.log(user);
      });
    if(selectedCandidate.isCandidateshortListed !=true){
      selectedCandidate.isCandidateshortListed=true;}
 else {selectedCandidate.isCandidateshortListed=false}

    this.updatedIdsModel.updatedCandidateInShortlistId=selectedCandidate._id;
    this.updatedIds.emit(this.updatedIdsModel);
    /*this.shortlisted = !this.shortlisted;*/

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
    this.updatedIdsModel.updatedCandidateIncartId=_id;
    this.updatedIds.emit(this.updatedIdsModel);
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
   "matching" : 10,
   "salary": "3 Lakhs",
   "experience": "2 year",
   "education": "Post Graduate",
   "location":"Mumbai",
   "proficiencies":["c"],
   "noticePeriod":"Within 1 month",
   "interestedIndustries":["OTHER"],

   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140,
   "mobile_number":"1234567891",
   "email":"k@gmail.com",
   "status":"",
   "picture":'',
   "isCandidateRead":true
   },
   {
   "_id": "2",
   "first_name" : "Tom",
   "last_name" : "ghatul",
   "matching" : 20,
   "salary": "1 Lakhs",
   "experience": "5 year",
   "education": "Under Graduate",
   "location":"Delhi",
   "proficiencies":["c++","java"],
   "noticePeriod":"Immediate",
   "interestedIndustries":["MNC","GK","OTHER"],

   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140,
   "mobile_number":"1234567891",
   "email":"k@gmail.com",
   "status":"",
   "picture":'',
   "isCandidateRead":true
   },
   {
   "_id": "3",
   "first_name" : "Ram",
   "last_name" : "ghatul",
   "matching" : 80,
   "salary": "3 Lakhs",
   "experience": "9 year",
   "education": "Graduate",
   "location":"Masco",
   "proficiencies":["xyz"],
   "noticePeriod":"Within 1 month",
   "interestedIndustries":["MNC","GK"],
   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140,
   "mobile_number":"1234567891",
   "email":"k@gmail.com",
   "status":"",
   "picture":'',
   "isCandidateRead":true
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
   "proficiencies":["c++","c","java"],
   "noticePeriod":"1-2 Month",
   "interestedIndustries":["MNC","PK","GK","OTHER","STARTUP"],
   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140,
   "mobile_number":"1234567891",
   "email":"k@gmail.com",
   "status":"",
   "picture":'',
   "isCandidateRead":true
   },
   {
   "_id": "5",
   "first_name" : "Narendra",
   "last_name" : "Modi",
   "matching" : 70,
   "salary": "5 Lakhs",
   "experience": "3 year",
   "education": "Post Graduate",
   "location":"Nashik",
   "proficiencies":["MNC"],
   "noticePeriod":"2-3 Month",
   "interestedIndustries":["java","c"],
   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140,
   "mobile_number":"1234567891",
   "email":"k@gmail.com",
   "status":"",
   "picture":'',
   "isCandidateRead":true
   },
   {
   "_id": "6",
   "first_name" : "Akshay",
   "last_name" : "Kumar",
   "matching" : 90,
   "salary": "6 Lakhs",
   "experience": "8 year",
   "education": "Graduate",
   "location":"Latur",
   "proficiencies":["c"],
   "noticePeriod":"Imm",
   "interestedIndustries":["MNC"],
   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140,
   "mobile_number":"1234567891",
   "email":"k@gmail.com",
   "status":"",
   "picture":'',
   "isCandidateRead":true
   },
   {
   "_id": "7",
   "first_name" : "jglgjfg",
   "last_name" : "Abcsa",
   "matching" : 100,
   "salary": "7 Lakhs",
   "experience": "10 year",
   "education": "Graduate",
   "location":"Aurangabad",
   "proficiencies":["java"],
   "noticePeriod":"Beyond 3 months",
   "interestedIndustries":["MNC","PK"],
   "below_one_step_matching": 20,
   "above_one_step_matching": 10,
   "exact_matching": 140,
   "mobile_number":"1234567891",
   "email":"k@gmail.com",
   "status":"",
   "picture":'',
   "isCandidateRead":true
   },
    {
      "_id": "8",
      "first_name" : "Mr:xyz",
      "last_name" : "Abcsa",
      "matching" : 60,
      "salary": "7 Lakhs",
      "experience": "4 year",
      "education": "Under Graduate",
      "location":"Nagar",
      "proficiencies":["c++"],
      "noticePeriod":"2-3 Month",
      "interestedIndustries":["MNC","PK"],
      "below_one_step_matching": 20,
      "above_one_step_matching": 10,
      "exact_matching": 140,
      "mobile_number":"1234567891",
      "email":"k@gmail.com",
      "status":"",
      "picture":'',
      "isCandidateRead":true
    },
    {
      "_id": "9",
      "first_name" : "Mr:xyz",
      "last_name" : "Abcsa",
      "matching" : 75,
      "salary": "12 Lakhs",
      "experience": "6 year",
      "education": "Under Graduate",
      "location":"Thane",
      "proficiencies":["xyz"],
      "noticePeriod":"Beyond 3 months",
      "interestedIndustries":["MNC","PK"],
      "below_one_step_matching": 20,
      "above_one_step_matching": 10,
      "exact_matching": 140,
      "mobile_number":"1234567891",
      "email":"k@gmail.com",
      "status":"",
      "picture":'',
      "isCandidateRead":true
    },
    {
      "_id": "10",
      "first_name" : "Mr:xyz",
      "last_name" : "Abcsa",
      "matching" : 50,
      "salary": "10 Lakhs",
      "experience": "1 year",
      "education": "Under Graduate",
      "location":"pune",
      "proficiencies":["c++"],
      "noticePeriod":"Immediate",
      "interestedIndustries":["MNC","PK"],
      "below_one_step_matching": 20,
      "above_one_step_matching": 10,
      "exact_matching": 140,
      "mobile_number":"1234567891",
      "email":"k@gmail.com",
      "status":"",
      "picture":'',
      "isCandidateRead":true
    }
   ]*/
}
