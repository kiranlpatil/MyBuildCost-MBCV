import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../../shared/constants';
import { ViewProjectService } from './viewProject.service';
import { Project } from './../../model/project';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'bi-view-project',
  templateUrl: 'viewProject.component.html'
})

export class ViewProjectComponent implements OnInit {

  viewProjectForm:  FormGroup;
  projects : any;
  model: Project = new Project();

  constructor(private ViewProjectService: ViewProjectService, private _router: Router, private formBuilder: FormBuilder) {

    this.viewProjectForm = this.formBuilder.group({
      'name': '',
      'region': '',
      'plotArea': '',
      'projectDuration': '',
      'plotPeriphery': ''
    });

  }

  ngOnInit() {
    this.getProjectDetails();
  }
  // createProject() {
  //   ///project/createProject
  //   this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
  // }

  getProjectDetails() {
    this.ViewProjectService.getProjectDetails().subscribe(
      project => this.onGetProjectSuccess(project),
      error => this.onGetProjectFail(error)
    );
  }

  onGetProjectSuccess(project : any) {
    console.log(project);
    this.model = project.data;
  }

  onGetProjectFail(error : any) {
    console.log(error);
  }

  // getMessages() {
  //   return Messages;
  // }
  //
  // getLabels() {
  //   return Label;
  // }
  //
  // getButtons() {
  //   return Button;
  // }
  //
  // getHeadings() {
  //   return Headings;
  // }
}
