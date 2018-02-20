import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes } from '../../../../../shared/constants';
import { ProjectListHeaderService } from './project-list-header.service';
import { SessionStorage,SessionStorageService } from '../../../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'bi-project-list-header',
  templateUrl: 'project-list-header.component.html',
  styleUrls:['./project-list-header.component.css']
})

export class ProjectListHeaderComponent implements OnInit {

  projectsArray : any;

  constructor(private projectListHeaderService: ProjectListHeaderService, private _router: Router) {

  }

  ngOnInit() {
    this.getProjects();
  }


  getProjects() {
    this.projectListHeaderService.getProject().subscribe(
      projects => this.onGetProjectSuccess(projects),
      error => this.onGetProjectFailure(error)
    );
  }

  onGetProjectSuccess(projects : any) {
    this.projectsArray = projects.data;
  }

  onGetProjectFailure(error : any) {
    console.log(error);
  }

  setCurrentProjectId(projectId:any) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT, projectId);
    this._router.navigate([NavigationRoutes.APP_COST_SUMMARY, projectId]);
  }

}

