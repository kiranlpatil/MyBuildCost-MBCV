import {Component, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-detail-list',
  templateUrl: 'recruiter-detail-list.component.html',
  styleUrls: ['recruiter-detail-list.component.css'],
})

export class RecruiterDetailListComponent {
  @Input() recruiters:any[]=new Array(0);

}



