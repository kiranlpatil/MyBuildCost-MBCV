import { Component } from '@angular/core';
import { Headings, Button, Label,Messages } from '../../../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationRoutes } from '../../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'bi-retain-project',
  templateUrl: 'retain-project.component.html',
  styleUrls: ['retain-project.component.css']
})

export class RetainProjectComponent {

  constructor(private activatedRoute:ActivatedRoute, private _router: Router) {
  }
   getMessage() {
    return Messages;
    }

    getButton() {
    return Button;
    }
    onCreateNewProject() {

    }
  onContinueWithExixtingProject() {

  }

  goToDashboard() {
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }
}
