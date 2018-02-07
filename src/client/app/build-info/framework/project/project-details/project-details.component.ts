import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../../shared/constants';
import { ProjectDetailsService } from './project-details.service';
import { Project } from './../../model/project';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../shared/index';
import {Message} from "../../../../shared/index";
import {SharedService} from "../../../../shared/services/shared-service";
import {ValidationService} from "../../../../shared/customvalidations/validation.service";
import { ProjectService } from '../project.service';

@Component({
  moduleId: module.id,
  selector: 'bi-view-project',
  templateUrl: 'project-details.component.html'
})

export class ProjectDetailsComponent implements OnInit {

  viewProjectForm:  FormGroup;
  project : any;
  projectId : any;
  model: Project = new Project();
  public isShowErrorMessage: boolean = true;
  public error_msg: boolean = false;

  constructor(private ViewProjectService: ProjectDetailsService, private _router: Router, private formBuilder: FormBuilder, private messageService: MessageService, private sharedService: SharedService,
              private activatedRoute:ActivatedRoute) {

    this.viewProjectForm = this.formBuilder.group({
      'name': ['', ValidationService.requiredProjectName],
      'region': ['', ValidationService.requiredProjectAddress],
      'plotArea': ['', ValidationService.requiredPlotArea],
      'projectDuration': ['', ValidationService.requiredProjectDuration],
      'plotPeriphery': ['', ValidationService.requiredPlotPeriphery]
    });

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
     this.projectId = params['projectId'];
      if(this.projectId) {
        this.getProjectDetails();
      }
    });
  }

  getProjectDetails() {
    this.ViewProjectService.getProjectDetails(this.projectId).subscribe(
      project => this.onGetProjectSuccess(project),
      error => this.onGetProjectFail(error)
    );
  }

  onGetProjectSuccess(project : any) {
    let projectDetails=project.data[0];
    this.model.name=projectDetails.name;
    this.model.region=projectDetails.region;
    this.model.plotArea=projectDetails.plotArea;
    this.model.projectDuration=projectDetails.projectDuration;
    this.model.plotPeriphery=projectDetails.plotPeriphery;
  }

  onGetProjectFail(error : any) {
    console.log(error);
  }


  onSubmit() {
    //this.submitted = true;
    if(this.viewProjectForm.valid) {
      this.model = this.viewProjectForm.value;
      this.ViewProjectService.updateProjectDetails(this.model)
        .subscribe(
          user => this.updateProjectDetailsSuccess(user),
          error => this.updateProjectDetailsError(error));
    }
  }

  updateProjectDetailsSuccess(result: any) {

    if (result !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_UPDATE_PROJECT_DETAILS;
      this.messageService.message(message);
    }
  }

  updateProjectDetailsError(error: any) {

    var message = new Message();

    if (error.err_code === 404 || error.err_code === 0) {
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.error_msg = error.err_msg;
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    }
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
