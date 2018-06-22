import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Button, NavigationRoutes } from '../../../../shared/constants';
import { Messages, SessionStorage, SessionStorageService } from '../../../../shared/index';
import { ProjectSubscriptionDetails } from '../../model/projectSubscriptionDetails';

@Component({
  moduleId: module.id,
  selector: 'bi-project-item',
  templateUrl: 'project-item.component.html',
  styleUrls: ['project-item.component.css']
})

export class ProjectItemComponent implements OnInit {

  @Input() project :  ProjectSubscriptionDetails;
  activeStatus:boolean;
  constructor(private _router: Router) {
  }
  ngOnInit() {
   sessionStorage.removeItem(SessionStorage.CURRENT_VIEW);
   this.activeStatus = this.project.activeStatus;
  }
  getMessage() {
    return Messages;
  }
  getButton() {
    return Button;
  }

  navigateToSelectedProject(projectId:string,projectName:string, numberOfDaysToExpire : number) {
    if(this.activeStatus && this.project.expiryMessage === null) {
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_ID, projectId);
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_NAME, projectName);
      SessionStorageService.setSessionValue(SessionStorage.NUMBER_OF_DAYS_TO_EXPIRE, numberOfDaysToExpire);
      SessionStorageService.setSessionValue(SessionStorage.STATUS, this.activeStatus);
      this._router.navigate([NavigationRoutes.APP_PROJECT, projectId, NavigationRoutes.APP_COST_SUMMARY]);
    }
  }

  goToRenew(projectId:string,projectName:string, numberOfDaysToExpire : number) {
    this._router.navigate([NavigationRoutes.APP_RENEW_PACKAGE, projectId, projectName, numberOfDaysToExpire]);
  }
}
