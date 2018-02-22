import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Messages, } from '../../../../shared/constants';
import { ProjectDetailsService } from './project-details.service';
import { Project } from './../../model/project';
import { Message, MessageService } from '../../../../shared/index';
import { ValidationService } from '../../../../shared/customvalidations/validation.service';

@Component({
  moduleId: module.id,
  selector: 'bi-view-project',
  templateUrl: 'project-details.component.html'
})

export class ProjectDetailsComponent implements OnInit {

  viewProjectForm:  FormGroup;
  project : any;
  projectId : any;
  projectModel: Project = new Project();
  public isShowErrorMessage: boolean = true;
  public error_msg: boolean = false;

  constructor(private ViewProjectService: ProjectDetailsService, private _router: Router, private formBuilder: FormBuilder,
              private messageService: MessageService, private activatedRoute:ActivatedRoute) {

    this.viewProjectForm = this.formBuilder.group({
      name: ['', ValidationService.requiredProjectName],
      region: ['', ValidationService.requiredProjectAddress],
      plotArea: ['', ValidationService.requiredPlotArea],
      plotPeriphery: ['', ValidationService.requiredPlotPeriphery],
      podiumArea : ['',ValidationService.requiredPodiumArea],
      openSpace : ['', ValidationService.requiredOpenSpace],
      slabArea : ['',ValidationService.requiredSlabArea],
      poolCapacity : ['',ValidationService.requiredSwimmingPoolCapacity],
      projectDuration: ['', ValidationService.requiredProjectDuration],
      totalNumOfBuildings : ['', ValidationService.requiredNumOfBuildings]
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
      project => this.onGetProjectDetailsSuccess(project),
      error => this.onGetProjectDetailsFailure(error)
    );
  }

  onGetProjectDetailsSuccess(project : any) {
    this.projectModel = project.data[0];
  }

  onGetProjectDetailsFailure(error : any) {
    console.log(error);
  }


  onSubmit() {
    if(this.viewProjectForm.valid) {
      this.projectModel = this.viewProjectForm.value;
      this.ViewProjectService.updateProjectDetails(this.projectModel)
        .subscribe(
          user => this.onUpdateProjectDetailsSuccess(user),
          error => this.onUpdateProjectDetailsFailure(error));
    }
  }

  onUpdateProjectDetailsSuccess(result: any) {

    if (result !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_UPDATE_PROJECT_DETAILS;
      this.messageService.message(message);
    }
  }

  onUpdateProjectDetailsFailure(error: any) {

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
}
