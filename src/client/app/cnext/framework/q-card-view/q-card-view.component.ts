import {Component} from "@angular/core";
import {CandidateQCard} from "../model/candidateQcard";
import {ShowQcardviewService} from "../showQCard.service";
import {QCardViewService} from "./q-card-view.service";
import {JobPosterModel} from "../model/jobPoster";

@Component({
  moduleId: module.id,
  selector: 'cn-q-card-view',
  templateUrl: 'q-card-view.component.html',
  styleUrls: ['q-card-view.component.scss'],

})
export class QCardviewComponent  {
  private candidates:CandidateQCard[] = new Array();
  private jobPosterModel:JobPosterModel=new JobPosterModel();
  private isShowQCardView:boolean;
  constructor(private qCardViewService: QCardViewService,private showQCardview:ShowQcardviewService) {
    this.showQCardview.showJobFilter$.subscribe(
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
        data => this.candidates = data.candidate);
  }
  }
  sortBy(){

  }
}
