import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes, Button } from '../../../shared/constants';
import { ProjectService } from '../project/project.service';
import { Project } from './../model/project';

@Component({
  moduleId: module.id,
  selector: 'bi-project-list',
  templateUrl: 'project-list.component.html',
  styleUrls: ['project-list.component.css']
})

export class ProjectListComponent implements OnInit {

  projects : Array<Project>;

  constructor(private projectService: ProjectService, private _router: Router) {
  }

  ngOnInit() {
    this.getAllProjects();
  }

  createProject() {
    this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe(
      projects => this.onGetAllProjectSuccess(projects),
      error => this.onGetAllProjectFailure(error)
    );
  }

  onGetAllProjectSuccess(projects : any) {
    this.projects = projects.data;
  }

  onGetAllProjectFailure(error : any) {
    console.log(error);
  }

  getButton() {
    return Button;
  }
}
