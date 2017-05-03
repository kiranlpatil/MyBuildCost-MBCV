import {  Component  } from '@angular/core';
import { ShowQcardviewService } from '../showQCard.service';
import {QCardViewService} from "../q-card-view/q-card-view.service";


@Component({
    moduleId: module.id,
    selector: 'cn-job-filter',
    templateUrl: 'job-filter.component.html',
    styleUrls: ['job-filter.component.css']
})

export class JobFilterComponent {
  private isShowJobFilter:boolean=false;
  constructor(private showQCardview:ShowQcardviewService) {
    this.showQCardview.showJobQCardView$.subscribe(
      data=> {
        this.isShowJobFilter=data;
      }
    );
  }
}
