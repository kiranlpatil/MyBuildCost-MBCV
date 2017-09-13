import { Component, Input } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { ValueConstant, Messages } from '../../../../shared/constants';


@Component({
  moduleId: module.id,
  selector: 'cn-award',
  templateUrl: 'award.component.html',
  styleUrls: ['award.component.css']
})

export class AwardComponent {
  @Input('group')
  public awardForm: FormGroup;

  @Input() submitStatus: boolean;
  private year: any;
  private currentDate: any;
  private yearList = new Array();
  private requiredNameValidationMessage = Messages.MSG_ERROR_VALIDATION_AWARD_NAME_REQUIRED
  private requiredAuthorityValidationMessage = Messages.MSG_ERROR_VALIDATION_AWARD_AUTHORITY_REQUIRED;
  private requiredYearValidationMessage = Messages.MSG_ERROR_VALIDATION_AWARD_YEAR_REQUIRED;

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



