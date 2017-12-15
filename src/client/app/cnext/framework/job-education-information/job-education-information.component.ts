import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfessionalDataService } from '../professional-data/professional-data.service';
import { ErrorService } from '../../../shared/services/error.service';
import { Messages } from '../../../shared/constants';


@Component({
  moduleId: module.id,
  selector: 'cn-job-education',
  templateUrl: 'job-education-information.component.html',
  styleUrls: []
})

export class JobEducationComponent {
  @Input('educationForm')
  public educationForm: FormGroup;
  @Input()submitStatus:boolean;
  educationDegrees: string[] = new Array(0);

  constructor(private professionalDataService: ProfessionalDataService,
              private errorService:ErrorService) {
    this.professionalDataService.getEducationDegreeList()
      .subscribe(
        data => {
          this.educationDegrees = data.educationalDegrees;
        }, error => this.errorService.onError(error));
  }
  getMessage() {
    return Messages;
  }

}



