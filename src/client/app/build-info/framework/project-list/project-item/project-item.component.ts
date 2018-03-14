import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes } from '../../../../shared/constants';
import { SessionStorage, SessionStorageService } from '../../../../shared/index';
import { Project } from '../../model/project';

@Component({
  moduleId: module.id,
  selector: 'bi-project-item',
  templateUrl: 'project-item.component.html'
})

export class ProjectItemComponent {

  @Input() project :  Project;

  constructor(private _router: Router) {
  }

  navigateToSelectedProject(projectId:string,projectName:string) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_ID, projectId);
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_NAME, projectName);
    this._router.navigate([NavigationRoutes.APP_PROJECT, projectId, NavigationRoutes.APP_COST_SUMMARY]);
  }
}
