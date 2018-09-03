import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentView, Messages } from '../../../../shared/constants';
import { ProjectService } from '../project.service';
import { Project } from './../../model/project';
import {LoaderService, Message, MessageService, SessionStorage, SessionStorageService} from '../../../../shared/index';
import { ProjectNameChangeService } from '../../../../shared/services/project-name-change.service';
import { ErrorService } from '../../../../shared/services/error.service';

@Component({
  moduleId: module.id,
  selector: 'bi-project-details',
  templateUrl: 'project-details.component.html',
  styleUrls: ['project-details.component.css']
})

export class ProjectDetailsComponent implements OnInit {

  projectId : string;
  projectModel: Project = new Project();
  public isShowErrorMessage: boolean = true;
  public errorMessage: boolean = false;
  public disabledName: boolean = false;

  constructor(private projectService: ProjectService, private projectNameChangeService : ProjectNameChangeService,
              private messageService: MessageService, private activatedRoute:ActivatedRoute,
              private errorService:ErrorService, private loaderService: LoaderService) {
  }

  ngOnInit() {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_VIEW,CurrentView.PROJECT_DETAILS);
    this.activatedRoute.params.subscribe(params => {
     this.projectId = params['projectId'];
      if(this.projectId) {
        this.getProject();
      }
    });
  }

  getProject() {
    this.loaderService.start();
    this.projectService.getProject(this.projectId).subscribe(
      project => this.onGetProjectSuccess(project),
      error => this.onGetProjectFailure(error)
    );
  }

  onGetProjectSuccess(project : any) {
    this.loaderService.stop();
    this.projectModel = project.data[0];
    if(this.projectModel.name.startsWith('Trial Project')) {
      this.disabledName = true;
    }else {
      this.disabledName = false;
    }
  }

  onGetProjectFailure(error : any) {
    this.loaderService.stop();
    if(error.err_code === 404 ||error.err_code === 401 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log(error);
  }


  updateProject(projectModel : Project) {
      this.loaderService.start();
      let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      this.projectService.updateProject(projectId, projectModel)
        .subscribe(
          user => this.onUpdateProjectSuccess(user),
          error => this.onUpdateProjectFailure(error));
  }

  onUpdateProjectSuccess(result: any) {
    this.loaderService.stop();
    if (result !== null) {
      this.projectNameChangeService.change(result.data.name);
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_NAME, result.data.name);
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_UPDATE_PROJECT_DETAILS;
      this.messageService.message(message);
    }
  }

  onUpdateProjectFailure(error: any) {

    var message = new Message();
    this.loaderService.stop();
    if (error.err_code === 404 || error.err_code === 401  || error.err_code === 0||error.err_code===500) {
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
}
