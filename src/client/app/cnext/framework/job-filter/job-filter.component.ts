import {  Component  } from '@angular/core';
import { ShowJobFilterService } from '../showJobFilter.service';


@Component({
    moduleId: module.id,
    selector: 'cn-job-filter',
    templateUrl: 'job-filter.component.html',
    styleUrls: ['job-filter.component.css']
})

export class JobFilterComponent {
  private isShowJobFilter:boolean=false;
  constructor( private showJobFilter:ShowJobFilterService) {
    this.showJobFilter.showJobFilter$.subscribe(
      data=> {
        this.isShowJobFilter=data;
      }
    );
  }
}
