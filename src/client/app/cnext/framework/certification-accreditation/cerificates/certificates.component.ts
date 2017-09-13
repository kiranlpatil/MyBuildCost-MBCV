import { Component, Input } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { ValueConstant, Messages } from '../../../../shared/constants';


@Component({
  moduleId: module.id,
  selector: 'cn-certificates',
  templateUrl: 'certificates.component.html',
  styleUrls: ['certificates.component.css']
})

export class CertificatesComponent {
  @Input('group')
  public certificateForm: FormGroup;

  @Input() submitStatus: boolean;

  private year: any;
  private currentDate: any;
  private yearList = new Array();
  private requiredNameValidationMessage = Messages.MSG_ERROR_VALIDATION_CERTIFICATION_NAME_REQUIRED
  private requiredAuthorityValidationMessage = Messages.MSG_ERROR_VALIDATION_CERTIFICATION_AUTHORITY_REQUIRED;
  private requiredYearValidationMessage = Messages.MSG_ERROR_VALIDATION_CERTIFICATION_YEAR_REQUIRED;

  constructor() {
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.year = this.year - ValueConstant.MAX_YEAR_LIST;
    this.createYearList(this.year); //TODO use the service for date list

  }

  createYearList(year: any) {
    for (let i = 0; i <= ValueConstant.MAX_YEAR_LIST; i++) {
      this.yearList.unshift(year++);
    }
  }
}



