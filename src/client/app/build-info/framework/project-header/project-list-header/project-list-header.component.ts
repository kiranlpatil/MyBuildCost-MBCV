import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes, Menus } from '../../../../shared/constants';
import { ProjectService } from '../../project/project.service';
import { SessionStorage,SessionStorageService } from '../../../../shared/index';
import { Project } from './../../model/project';

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

  constructor(private projectService: ProjectService, private _router: Router) {
  }

  ngOnInit() {
    this.currentView = SessionStorageService.getSessionValue(SessionStorage.CURRENT_VIEW);
    if(SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME) === undefined ||
      SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME) === null) {
      this.selectedProjectName='My Projects';
    } else {
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
  }

  onGetAllProjectsFailure(error : any) {
    console.log(error);
  }

  selectedProject(projectName:string) {
     if(projectName==='My Projects') {
      sessionStorage.removeItem(SessionStorage.CURRENT_PROJECT_ID);
      sessionStorage.removeItem(SessionStorage.CURRENT_PROJECT_NAME);
      this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
    } else {
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_NAME, projectName);
      let projectList : Array<Project>;
      projectList = this.projects.filter(
        function( project: Project){
          return project.name === projectName;
        });
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_ID, projectList[0]._id);
      this._router.navigate([NavigationRoutes.APP_PROJECT, projectList[0]._id, NavigationRoutes.APP_COST_SUMMARY]);
    }
  }

  getMenus() {
    return Menus;
  }
}
