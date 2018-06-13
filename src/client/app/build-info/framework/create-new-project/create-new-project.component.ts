import { Component } from '@angular/core';
import { ImagePath, NavigationRoutes } from '../../../shared/index';
import { Headings, Button, Label } from '../../../shared/constants';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'bi-create-new-project',
  templateUrl: 'create-new-project.component.html',
  styleUrls: ['create-new-project.component.css'],
})
export class CreateNewProjectComponent {
  BODY_BACKGROUND_TRANSPARENT: string;
  MY_LOGO: string;

  constructor(private _router: Router) {
    this.BODY_BACKGROUND_TRANSPARENT = ImagePath.BODY_BACKGROUND_TRANSPARENT;
    this.MY_LOGO = ImagePath.MY_WHITE_LOGO;
  }

  goToCreateProject() {
    this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
  }

  goToPaymentDetails() {
    this._router.navigate([NavigationRoutes.APP_PACKAGE_DETAILS]);
  }

  getHeadings() {
    return Headings;
  }

  getLabels() {
    return Label;
  }

  getButton() {
    return Button;
  }
}
