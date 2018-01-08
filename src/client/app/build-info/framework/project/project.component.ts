import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../shared/constants';
import { ProjectService } from './project.service';
import { Project } from './../model/project';

@Component({
  moduleId: module.id,
  selector: 'bi-project',
  templateUrl: 'project.component.html'
})

export class ProjectComponent implements OnInit {

  projectForm:  FormGroup;
  projects : any;
  model: Project = new Project();

  constructor(private projectService: ProjectService, private _router: Router, private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    console.log('Inside Project Home Component');
  }

  createProject() {
    this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
  }

  navigateTo(nav:string) {
    this._router.navigate([nav]);
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
