import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes } from '../../../../shared/constants';
import { ProjectListService } from './project-list.service';
import { SessionStorage, SessionStorageService } from '../../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'bi-list-project',
  templateUrl: 'project-list.component.html',
  styleUrls: ['project-list.component.css']
})

export class ProjectListComponent implements OnInit {

  projects : any;

  constructor(private listProjectService: ProjectListService, private _router: Router) {

  }

  ngOnInit() {
    this.getProjects();
  }
  createProject() {
    this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
  }

  getProjects() {
    this.listProjectService.getProject().subscribe(
      projects => this.onGetProjectSuccess(projects),
      error => this.onGetProjectFailure(error)
    );
  }

  onGetProjectSuccess(projects : any) {
    this.projects = projects.data;
  }

  onGetProjectFailure(error : any) {
    console.log(error);
  }

  setCurrentProjectId(projectId:any) {
   SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT, projectId);
   this._router.navigate([NavigationRoutes.APP_COST_SUMMARY, projectId]);
  }
}
