import {Component} from "@angular/core";
import {CandidateQCard} from "../model/candidateQcard";
import {ShowQcardviewService} from "../showQCard.service";
import {QCardViewService} from "./q-card-view.service";
import {JobPosterModel} from "../model/jobPoster";
import {QCardsortBy} from "../model/q-cardview-sortby";

@Component({
  moduleId: module.id,
  selector: 'cn-q-card-view',
  templateUrl: 'q-card-view.component.html',
  styleUrls: ['q-card-view.component.css'],

})
export class QCardviewComponent  {
  private candidates:CandidateQCard[] = new Array();
  private toggle:boolean=false;
  private matches:number;
  private jobPosterModel:JobPosterModel=new JobPosterModel();
  private qCardModel:QCardsortBy=new QCardsortBy();
  private isShowQCardView:boolean;
  constructor(private qCardViewService: QCardViewService,private showQCardview:ShowQcardviewService) {
    this.showQCardview.showJobQCardView$.subscribe(
      data=> {
        this.isShowQCardView=data,
          this.showQCardView();
      }
    );

  }
  showQCardView()
  {if(this.isShowQCardView) {
    this.qCardViewService.getSearchedcandidate(this.jobPosterModel)
      .subscribe(
        data =>{ this.candidates = data.candidate,
      this.matches=this.candidates.length});
  }
  }
  sortBy(){
  this.toggleFormat();
  }
  get formatcandidate()   {
    console.log(this.qCardModel.name);
    return this.toggle ? this.qCardModel.name :"JobMatching"; }
  toggleFormat() {
    this.toggle = true; }

}
