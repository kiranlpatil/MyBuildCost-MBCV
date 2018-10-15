import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { NavigationRoutes, Menus } from '../../../../shared/constants';
import { ProjectService } from '../../project/project.service';
import { SessionStorage,SessionStorageService } from '../../../../shared/index';
import { Project } from './../../model/project';
import { ProjectNameChangeService } from '../../../../shared/services/project-name-change.service';
import { ProjectSubscriptionDetails } from '../../model/projectSubscriptionDetails';

@Component({
  moduleId: module.id,
  selector: 'bi-project-selector',
  templateUrl: 'project-list-header.component.html',
  styleUrls:['./project-list-header.component.css']
})

export class ProjectListHeaderComponent implements OnInit {

  projects : Array<ProjectSubscriptionDetails>;
  selectedProjectName : string;
  projectId :string;
  currentView : string;
  projectNameSubscription : Subscription;

  constructor(private projectService: ProjectService, private _router: Router,
              private projectNameChangeService : ProjectNameChangeService) {

    this.projectNameSubscription = projectNameChangeService.changeProjectName$.subscribe(
      projectName => {
        this.selectedProjectName = projectName;
        this.getAllProjects();
      });
  }

  ngOnInit() {
    this.currentView = SessionStorageService.getSessionValue(SessionStorage.CURRENT_VIEW);
    if( SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME) !== 'undefined' &&
      SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME) !== 'null' &&
      SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME) !== null) {
      this.selectedProjectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
      this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    }
    if(this.currentView === 'costSummary') {
      this.getAllProjects();
    }
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe(
      projects => this.onGetAllProjectsSuccess(projects),
      error => this.onGetAllProjectsFailure(error)
    );
  }

  onGetAllProjectsSuccess(projects : any) {
    let array = projects.data;
    let activeProjects =[];
    for(let projectIndex =0; projectIndex< array.length; projectIndex++) {
      if(array[projectIndex].activeStatus) {
       activeProjects.push(array[projectIndex]);
      }
    }
    this.projects = activeProjects;
    if((this.currentView === 'costSummary'|| this.currentView === 'materialTakeOff' || this.currentView === 'projectDetails')
      && SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME) === null ) {
      if (this.projects.length !== 0) {
        let projectList: Array<ProjectSubscriptionDetails>;
        projectList = this.projects.filter(
          function (projectDetails: ProjectSubscriptionDetails) {
            return projectDetails.projectId.toString() ===
              SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID).toString();
          });
        SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_NAME, projectList[0].projectName);
        SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_ID, projectList[0].projectId);
      }
    }
  }

  onGetAllProjectsFailure(error : any) {
    console.log(error);
  }

  selectedProject(projectName:string) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_NAME, projectName);
    if (this.projects.length !== 0) {
      let projectList: Array<ProjectSubscriptionDetails>;
      projectList = this.projects.filter(
        function (projectDetails: ProjectSubscriptionDetails) {
          return projectDetails.projectName === projectName;
        });

      SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_ID, projectList[0].projectId);
      this._router.navigate([NavigationRoutes.APP_PROJECT, projectList[0].projectId, NavigationRoutes.APP_COST_SUMMARY]);
    }
  }

  getMenus() {
    return Menus;
  }
}
