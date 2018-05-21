import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { NavigationRoutes, Menus } from '../../../../shared/constants';
import { ProjectService } from '../../project/project.service';
import { SessionStorage,SessionStorageService } from '../../../../shared/index';
import { Project } from './../../model/project';
import { ProjectNameChangeService } from '../../../../shared/services/project-name-change.service';

@Component({
  moduleId: module.id,
  selector: 'bi-project-selector',
  templateUrl: 'project-list-header.component.html',
  styleUrls:['./project-list-header.component.css']
})

export class ProjectListHeaderComponent implements OnInit {

  projects : Array<Project>;
  selectedProjectName : string;
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
      SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME) !== 'null') {
      this.selectedProjectName=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
    }
    this.getAllProjects();
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe(
      projects => this.onGetAllProjectsSuccess(projects),
      error => this.onGetAllProjectsFailure(error)
    );
  }

  onGetAllProjectsSuccess(projects : any) {
    this.projects = projects.data;
    if((this.currentView === 'costSummary'|| this.currentView === 'materialTakeOff' || this.currentView === 'projectDetails') && SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME) === null ){
      let projectList : Array<Project>;
      projectList = this.projects.filter(
        function( project: Project){
          return project._id.toString() == SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID).toString();
        });
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_NAME,  projectList[0].name);
    }
  }

  onGetAllProjectsFailure(error : any) {
    console.log(error);
  }

  selectedProject(projectName:string) {
     SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_NAME, projectName);
      let projectList : Array<Project>;
      projectList = this.projects.filter(
        function( project: Project){
          return project.name === projectName;
        });
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_ID, projectList[0]._id);
      this._router.navigate([NavigationRoutes.APP_PROJECT, projectList[0]._id, NavigationRoutes.APP_COST_SUMMARY]);
  }

  getMenus() {
    return Menus;
  }
}
