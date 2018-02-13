import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../../../shared/constants';
import { ProjectListHeaderService } from './project-list-header.service';
import { Project } from '../../../model/project';
import { SessionStorage,SessionStorageService } from '../../../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'bi-project-list-header',
  templateUrl: 'project-list-header.component.html',
  styleUrls:['./project-list-header.component.css']
})

export class ProjectListHeaderComponent implements OnInit {

  projectForm:  FormGroup;
  projectsArray : any;
  model: Project = new Project();

  constructor(private projectListHeaderService: ProjectListHeaderService, private _router: Router, private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.getProjects();
  }


  getProjects() {
    this.projectListHeaderService.getProject().subscribe(
      projects => this.onGetProjectSuccess(projects),
      error => this.onGetProjectFail(error)
    );
  }

  getProjectDetails() {
    this.projectListHeaderService.getProject().subscribe(
      project => this.onGetProjectDetailsSuccess(project),
      error => this.onGetProjectDetailsFail(error)
    );
  }


  onGetProjectSuccess(projects : any) {
    console.log(projects);
    this.projectsArray = projects.data;
  }

  onGetProjectFail(error : any) {
    console.log(error);
  }

  onGetProjectDetailsSuccess(projects : any) {
    console.log(projects);
    this.projectsArray = projects.data[0];
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

