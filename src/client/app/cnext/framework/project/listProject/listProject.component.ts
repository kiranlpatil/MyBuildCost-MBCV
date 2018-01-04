import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../../shared/constants';
import { ListProjectService } from './listProjest.service';
import { Project } from './../../model/project';

@Component({
  moduleId: module.id,
  selector: 'bi-list-project',
  templateUrl: 'listProject.component.html'
})

export class ListProjectComponent implements OnInit {

  projectForm:  FormGroup;
  projects : any;
  model: Project = new Project();

  constructor(private listProjectService: ListProjectService, private _router: Router, private formBuilder: FormBuilder) {

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

  onGetProjectSuccess(projects : any) {
    console.log(projects);
    this.projects = projects.data;
  }

  onGetProjectFail(error : any) {
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
}
