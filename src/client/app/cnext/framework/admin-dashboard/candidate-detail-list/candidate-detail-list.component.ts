import {Component, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-detail-list',
  templateUrl: 'candidate-detail-list.component.html',
  styleUrls: ['candidate-detail-list.component.css'],
})

export class CandidateDetailListComponent {
  @Input() candidates:any[]=new Array(0);

}



