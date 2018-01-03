import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../../shared/constants';
import { CreateProjectService } from './createProject.service';
import { Project } from './../../model/project';

@Component({
  moduleId: module.id,
  selector: 'bi-create-project',
  templateUrl: 'createProject.component.html'
})

export class CreateProjectComponent implements OnInit {

  projectForm:  FormGroup;
  projects : any;
  model: Project = new Project();

  constructor(private createProjectService: CreateProjectService, private _router: Router, private formBuilder: FormBuilder) {

    this.projectForm = this.formBuilder.group({
      'name': '',
      'region': '',
      'plotArea': '',
      'projectDuration': '',
      'plotPeriphery': ''
    });

  }

  ngOnInit() {
    //this.getProjects();
    console.log('Inside Create Project');
  }

  onSubmit() {
    //this.projectService
    if(this.projectForm.valid) {
      this.model = this.projectForm.value;
      this.createProjectService.createProject(this.model)
        .subscribe(
          project => this.projectCreationSuccess(project),
          error => this.projectCreationFailed(error));
    }
  }

  projectCreationSuccess(project : any) {
    console.log(project);
    //this.getProjects();
    this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
  }

  projectCreationFailed(error : any) {
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
