import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes, ImagePath, Headings, Label, Button } from '../../../shared/constants';
import { SessionStorage, SessionStorageService,  Message, Messages, MessageService } from '../../../shared/index';
import { ProjectService } from '../project/project.service';
import { Project } from './../model/project';

@Component({
  moduleId: module.id,
  selector: 'bi-create-project',
  templateUrl: 'create-project.component.html',
  styleUrls: ['create-project.component.css']
})

export class CreateProjectComponent implements  OnInit {

  public isShowErrorMessage: boolean = true;
  public errorMessage: boolean = false;
  public isUserSignIn: number;
  BODY_BACKGROUND_TRANSPARENT: string;

  constructor(private _router: Router, private projectService : ProjectService, private messageService : MessageService) {
    this.BODY_BACKGROUND_TRANSPARENT = ImagePath.BODY_BACKGROUND_TRANSPARENT;
  }
  ngOnInit() {
    this.isUserSignIn = parseFloat(SessionStorageService.getSessionValue(SessionStorage.IS_USER_SIGN_IN));
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_VIEW,'createProject');
  }

  onSubmit(projectModel : Project) {
      this.projectService.createProject(projectModel)
        .subscribe(
          project => this.onCreateProjectSuccess(project),
          error => this.onCreateProjectFailure(error));
  }

  onCreateProjectSuccess(project : any) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_ID, project._id);
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_NAME, project.name);
    SessionStorageService.setSessionValue(SessionStorage.STATUS, project.activeStatus);
    if(project.name !== undefined && project.name.includes(this.getLabels().PREFIX_TRIAL_PROJECT)) {
      SessionStorageService.setSessionValue(SessionStorage.NUMBER_OF_DAYS_TO_EXPIRE, this.getLabels().INITIAL_NUMBER_OF_DAYS_TO_EXPIRE);
    }
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_PROJECT_CREATION;
    this.messageService.message(message);
    this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
  }

  onCreateProjectFailure(error : any) {
    console.log(error);
    var message = new Message();
    if (error.err_code === 404 ||error.err_code === 401 || error.err_code === 0||error.err_code===500) {
      message.error_msg = error.err_msg;
      message.error_code =  error.err_code;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.errorMessage = error.err_msg;
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    }
  }

  goBack() {
    sessionStorage.removeItem(SessionStorage.CURRENT_VIEW);
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }

  getHeadings() {
    return Headings;
  }

  getLabels() {
    return Label;
  }

  getButton() {
    return Button;
  }
}
