import {Component, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-header',
  templateUrl: 'recruiter-header.component.html',
  styleUrls: ['recruiter-header.component.css'],
})

export class RecruiterHeaderComponent {
  @Input() jobCount: any;
  @Input() companyName: string;
  @Input() headerInfo: any;

  constructor() {

  }
}

