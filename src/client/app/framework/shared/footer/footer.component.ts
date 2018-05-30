import { Component } from '@angular/core';
import { API, AppSettings, Messages, ProjectAsset } from '../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'tpl-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css'],
})
export class FooterComponent {
  APP_NAME: string;
  UNDER_LICENCE: string;

  constructor() {
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.UNDER_LICENCE = ProjectAsset.UNDER_LICENECE;
  }

 /*ToDo For future use
   goToFaq() {
  }

  getMessage() {
    return Messages;
  }*/
}
