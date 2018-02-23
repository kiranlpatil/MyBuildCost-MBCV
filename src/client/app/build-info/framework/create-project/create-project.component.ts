import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationRoutes, ImagePath } from '../../../shared/constants';
import { SessionStorage, SessionStorageService,  Message, Messages, MessageService } from '../../../shared/index';
import { ProjectService } from '../project/project.service';
import { Project } from './../model/project';
import { ValidationService } from './../../../shared/customvalidations/validation.service';

@Component({
  moduleId: module.id,
  selector: 'bi-create-project',
  templateUrl: 'create-project.component.html',
  styleUrls: ['create-project.component.css']
})

export class CreateProjectComponent {

  projectForm:  FormGroup;
  projects : any;
  public isShowErrorMessage: boolean = true;
  public error_msg: boolean = false;
  projectModel: Project = new Project();
  BODY_BACKGROUND_TRANSPARENT: string;

  constructor(private projectService: ProjectService, private _router: Router, private formBuilder: FormBuilder,
  private messageService: MessageService ) {
    this.BODY_BACKGROUND_TRANSPARENT = ImagePath.BODY_BACKGROUND_TRANSPARENT;

    this.projectForm = this.formBuilder.group({
      name : ['', ValidationService.requiredProjectName],
      region : ['', ValidationService.requiredProjectAddress],
      plotArea : ['', ValidationService.requiredPlotArea],
      plotPeriphery : ['', ValidationService.requiredPlotPeriphery],
      podiumArea : ['',ValidationService.requiredPodiumArea],
      openSpace : ['', ValidationService.requiredOpenSpace],
      slabArea : ['',ValidationService.requiredSlabArea],
      poolCapacity : ['',ValidationService.requiredSwimmingPoolCapacity],
      projectDuration : ['', ValidationService.requiredProjectDuration],
      totalNumOfBuildings : ['', ValidationService.requiredNumOfBuildings]
    });

  }



  onSubmit() {
    if(this.projectForm.valid) {
      this.projectModel = this.projectForm.value;
      this.projectService.createProject(this.projectModel)
        .subscribe(
          project => this.onCreateProjectSuccess(project),
          error => this.onCreateProjectFailure(error));
    }
  }

  onCreateProjectSuccess(project : any) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT, project._id);
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_PROJECT_CREATION;
    this.messageService.message(message);
    this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
  }

  onCreateProjectFailure(error : any) {
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
  goBack() {
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }
}
