import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AppSettings,
  Label,
  Button,
  Headings,
  NavigationRoutes, ImagePath
} from '../../../../shared/constants';
import { API, BaseService, SessionStorage, SessionStorageService,  Message,
  Messages,
  MessageService } from '../../../../shared/index';
import { CreateProjectService } from './create-project.service';
import { Project } from './../../model/project';
import { ValidationService } from './../../../../shared/customvalidations/validation.service';
import { SharedService } from '../../../../shared/services/shared-service';

@Component({
  moduleId: module.id,
  selector: 'bi-create-project',
  templateUrl: 'create-project.component.html',
  styleUrls: ['create-project.component.css']
})

export class CreateProjectComponent implements OnInit {

  projectForm:  FormGroup;
  projects : any;
  public isShowErrorMessage: boolean = true;
  public error_msg: boolean = false;
  model: Project = new Project();
  BODY_BACKGROUND_TRANSPARENT: string;

  constructor(private createProjectService: CreateProjectService, private _router: Router, private formBuilder: FormBuilder,
  private messageService: MessageService, private sharedService: SharedService) {
    this.BODY_BACKGROUND_TRANSPARENT = ImagePath.BODY_BACKGROUND_TRANSPARENT;

    this.projectForm = this.formBuilder.group({
      'name': ['', ValidationService.requiredProjectName],
      'region': ['', ValidationService.requiredProjectAddress],
      'plotArea': ['', ValidationService.requiredPlotArea],
      'plotPeriphery': ['', ValidationService.requiredPlotPeriphery],
      'podiumArea': ['',ValidationService.requiredPodiumArea],
      'openSpace':['', ValidationService.requiredOpenSpace],
      'slabArea': ['',ValidationService.requiredSlabArea],
      'poolCapacity': ['',ValidationService.requiredSwimmingPoolCapacity],
      'projectDuration': ['', ValidationService.requiredProjectDuration],
      'totalNoOfBuildings': ['', ValidationService.requiredNoOfBuildings],
    });

  }

  ngOnInit() {
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
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT, project._id);
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_PROJECT_CREATION;
    this.messageService.message(message);
    this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
  }

  projectCreationFailed(error : any) {
    console.log(error);
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
