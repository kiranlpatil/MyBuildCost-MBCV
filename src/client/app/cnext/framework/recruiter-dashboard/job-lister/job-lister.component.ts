import {Component, Input, EventEmitter, Output, OnInit, OnDestroy} from '@angular/core';
import {CandidateNumberDifferentList} from "./candidate-diff-list";
import {JobPosterModel} from "../../model/jobPoster";
import {QCardsortBy} from "../../model/q-cardview-sortby";
import {CandidateInCartService} from "../../candidate-in-cart.service";
import {ValueConstant} from "../../../../framework/shared/constants";
import {RecruiterDashboard} from "../../model/recruiter-dashboard";
import {Router} from "@angular/router";
import {RecruiterHeaderDetails} from "../../model/recuirterheaderdetails";
import {ReferenceService} from "../../model/newClass";



@Component({
  moduleId: module.id,
  selector: 'cn-job-lister',
  templateUrl: 'job-lister.component.html',
  styleUrls: ['job-lister.component.css'],
})

export class JobListerComponent implements OnInit, OnDestroy{
  @Input() jobListInput: any[] = new Array(0);
  @Input() headerInfoForJob:RecruiterHeaderDetails;
  //public jobList:JobPosterModel[] = new Array(0);
  //public jobListToCheck:JobPosterModel[] = new Array(0);
  private toggle:boolean=false;
  private qCardModel:QCardsortBy=new QCardsortBy();
 // private candidatesInList : CandidateNumberDifferentList= new CandidateNumberDifferentList();
  //private candidatesInLists : RecruiterDashboard= new RecruiterDashboard();
  @Output() jobEventEmitter : EventEmitter<any> =new EventEmitter();

  constructor(private _router:Router,public refrence:ReferenceService) {
    this.qCardModel.name='Date';
  }

  ngOnChanges(changes: any) {
    /*if (changes.jobListInput.currentValue != undefined && changes.jobListInput.currentValue.length > 0) {
      this.jobListInput = changes.jobListInput.currentValue;
     //this.candidatesInLists= new CandidateNumberDifferentList();
      this.candidatesInLists= new RecruiterDashboard();
      for (let i = 0; i < this.jobListInput.length; i++) {
        for (let list of this.jobListInput[i].candidate_list) {
          if (list.name == ValueConstant.CART_LISTED_CANDIDATE) {
            this.jobListInput[i].candidateInCart = list.ids.length;
            //this.candidatesInLists.totalNumberOfCandidateInCart+= list.ids.length;
          }
          if (list.name == ValueConstant.APPLIED_CANDIDATE) {
            //this.candidatesInLists.totalNumberOfCandidatesApplied+= list.ids.length;
          }
        }
      }
      this.candidateInCartService.change(this.candidatesInLists);
    }*/
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.refrence.data = this.headerInfoForJob;
  }
  sortBy(){
    this.toggleFormat();
  }

  onJobClikecd(item : any){
    //this.jobEventEmitter.emit(item);
    this._router.navigate(['jobdashboard/',item]);
  }

  get format() {
    return this.toggle ? this.qCardModel.name :"Date";
  }

  toggleFormat() {
    this.toggle = true;
  }

}
