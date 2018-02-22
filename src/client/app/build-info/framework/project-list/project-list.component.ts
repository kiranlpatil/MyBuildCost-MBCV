import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes } from '../../../shared/constants';
import { ProjectListService } from './project-list.service';
import { Project } from './../model/project';

@Component({
  moduleId: module.id,
  selector: 'bi-project-list',
  templateUrl: 'project-list.component.html',
  styleUrls: ['project-list.component.css']
})

export class ProjectListComponent implements OnInit {

  projects : Array<Project>;

  constructor(private projectListService: ProjectListService, private _router: Router) {
  }

  ngOnInit() {
    this.getAllProjects();
  }

  createProject() {
    this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
  }

  getAllProjects() {
    this.projectListService.getAllProjects().subscribe(
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
}
