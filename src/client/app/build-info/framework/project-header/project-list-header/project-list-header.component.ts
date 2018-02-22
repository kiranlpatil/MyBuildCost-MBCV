import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes } from '../../../../shared/constants';
import { ProjectListHeaderService } from './project-list-header.service';
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

  constructor(private projectListHeaderService: ProjectListHeaderService, private _router: Router) {

  }

  ngOnInit() {
    this.getAllProjects();
  }

  getAllProjects() {
    this.projectListHeaderService.getAllProjects().subscribe(
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

  selectedProject(projectId:any) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT, projectId);
    this._router.navigate([NavigationRoutes.APP_PROJECT, projectId, NavigationRoutes.APP_COST_SUMMARY]);
  }

}

