import { Component } from '@angular/core';
import { Headings, Button, Label,Messages } from '../../../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationRoutes } from '../../../../shared/index';
import { Message, MessageService, SessionStorage, SessionStorageService } from '../../../../shared/index';
import { Project } from '../../model/project';
import { ProjectService } from '../../project/project.service';
import { ProjectNameChangeService } from '../../../../shared/services/project-name-change.service';

@Component({
  moduleId: module.id,
  selector: 'bi-payment-success',
  templateUrl: 'payment-successful.component.html',
  styleUrls: ['payment-successful.component.css']
})

export class PaymentSuccessfulComponent {

  projectId: string;
  projectModel:  Project = new Project();
  public isShowErrorMessage: boolean = true;
  public errorMessage: boolean = false;
  constructor(private activatedRoute:ActivatedRoute, private _router: Router, private projectService: ProjectService,
              private projectNameChangeService : ProjectNameChangeService, private messageService : MessageService) {
  }

  getProject() {
    this.projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.projectService.getProject(this.projectId).subscribe(
      project => this.onGetProjectSuccess(project),
      error => this.onGetProjectFailure(error)
    );
  }

  onGetProjectSuccess(project : any) {
    this.projectModel = project.data[0];
    this.projectModel.name = project.data[0].name.substring(14);
    this.updateProject(this.projectModel);
  }

  onGetProjectFailure(error : any) {
    console.log(error);
  }

  /*getProject() {
  this.projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
   let projectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
   this.projectModel.name = projectName.substring(14);
   this.updateProject(this.projectModel);
  }*/

  updateProject(projectModel : Project) {
    this.projectService.updateProject(this.projectId, projectModel)
      .subscribe(
        user => this.onUpdateProjectSuccess(user),
        error => this.onUpdateProjectFailure(error));
  }

  onUpdateProjectSuccess(result: any) {
    if (result !== null) {
      this.projectNameChangeService.change(result.data.name);
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_NAME, result.data.name);
    }
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }

  onUpdateProjectFailure(error: any) {
    console.log(error);
  }

  goToDashboard() {
    this.getProject();
   // this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }
}
