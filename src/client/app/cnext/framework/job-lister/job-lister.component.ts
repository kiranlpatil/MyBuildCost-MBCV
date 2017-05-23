import {  Component,Input,EventEmitter,Output  } from '@angular/core';
import {CandidateNumberDifferentList} from "./candidate-diff-list";
import {JobPosterModel} from "../model/jobPoster";
import {QCardsortBy} from "../model/q-cardview-sortby";
import {CandidateInCartService} from "../candidate-in-cart.service";
import {ValueConstant} from "../../../framework/shared/constants";


@Component({
  moduleId: module.id,
  selector: 'cn-job-lister',
  templateUrl: 'job-lister.component.html',
  styleUrls: ['job-lister.component.css']
})

export class JobListerComponent {
  @Input() jobListInput: any[] = new Array(0);
  public jobList:JobPosterModel[] = new Array(0);
  public jobListToCheck:JobPosterModel[] = new Array(0);
  private toggle:boolean=false;
  private qCardModel:QCardsortBy=new QCardsortBy();
  private candidatesInList : CandidateNumberDifferentList= new CandidateNumberDifferentList();
  @Output() jobEventEmitter : EventEmitter<any> =new EventEmitter();

  constructor(private candidateInCartService : CandidateInCartService) {
    this.qCardModel.name='Date';
  }

  ngOnChanges(changes: any) {
    if (changes.jobListInput.currentValue != undefined && changes.jobListInput.currentValue.length > 0) {
      this.jobListInput = changes.jobListInput.currentValue;
      this.candidatesInList= new CandidateNumberDifferentList();
      for (let i = 0; i < this.jobListInput.length; i++) {
        for (let list of this.jobListInput[i].candidate_list) {
          if (list.name == ValueConstant.CART_LISTED_CANDIDATE) {
            this.jobListInput[i].candidateInCart = list.ids.length;
            this.candidatesInList.cart += list.ids.length;
          }
          if (list.name == ValueConstant.APPLIED_CANDIDATE) {
            this.candidatesInList.applied += list.ids.length;
          }
        }
      }
      this.candidateInCartService.change(this.candidatesInList);
    }
  }

  sortBy(){
    this.toggleFormat();
  }

  onJobClikecd(item : any){
    this.jobEventEmitter.emit(item);
  }
  get format() {
    return this.toggle ? this.qCardModel.name :"Date";
  }

  toggleFormat() {
    this.toggle = true;
  }

}
