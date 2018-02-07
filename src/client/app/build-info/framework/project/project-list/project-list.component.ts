import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../../shared/constants';
import { ProjectListService } from './project-list.service';
import { Project } from './../../model/project';
import {SessionStorage, SessionStorageService} from '../../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'bi-list-project',
  templateUrl: 'project-list.component.html'
})

export class ProjectListComponent implements OnInit {

  projectForm:  FormGroup;
  projects : any;
  model: Project = new Project();

  constructor(private listProjectService: ProjectListService, private _router: Router, private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.getProjects();
  }
  createProject() {
    ///project/createProject
    this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
  }

  getProjects() {
    this.listProjectService.getProject().subscribe(
      projects => this.onGetProjectSuccess(projects),
      error => this.onGetProjectFail(error)
    );
  }

  getProjectDetails(){
      this.listProjectService.getProject().subscribe(
        project => this.onGetProjectDetailsSuccess(project),
        error => this.onGetProjectDetailsFail(error)
      );
  }


  onGetProjectSuccess(projects : any) {
    console.log(projects);
    this.projects = projects.data;
  }

  onGetProjectFail(error : any) {
    console.log(error);
  }

  onGetProjectDetailsSuccess(projects : any) {
    console.log(projects);
    this.projects = projects.data[0];
  }

  onGetProjectDetailsFail(error : any) {
    console.log(error);
  }

  getMessages() {
    return Messages;
  }

  getLabels() {
    return Label;
  }

  getButtons() {
    return Button;
  }

  getHeadings() {
    return Headings;
  }

  setCurrentProjectId(projectId:any) {
    console.log('Project ID'+JSON.stringify(projectId));
   SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT, projectId);
   this._router.navigate([NavigationRoutes.APP_COST_SUMMARY, projectId]);
  }
}
