import {Component, OnInit} from '@angular/core';
import { Headings, Button, Label,Messages, } from '../../../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import {CommonService, NavigationRoutes} from '../../../../shared/index';
import { Message, MessageService, SessionStorage, SessionStorageService } from '../../../../shared/index';
import { Project } from '../../model/project';
import { ProjectService } from '../../project/project.service';
import { ProjectNameChangeService } from '../../../../shared/services/project-name-change.service';
import {ProjectSubscriptionDetails} from "../../model/projectSubscriptionDetails";
import {PackageDetailsService} from "../../package-details/package-details.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  moduleId: module.id,
  selector: 'bi-payment-success',
  templateUrl: 'payment-successful.component.html',
  styleUrls: ['payment-successful.component.css']
})

export class PaymentSuccessfulComponent implements OnInit {

  projectId: string;
  packageName: string;
  projects: any;
  projectModel: Project = new Project();
  removeTrialProjectPrefix: boolean = false;
  numOfPurchasedBuilding:number;
  totalBilled :number;
  public isShowErrorMessage: boolean = true;
  public errorMessage: boolean = false;


  constructor(private activatedRoute: ActivatedRoute, private _router: Router, private projectService: ProjectService,
              private projectNameChangeService: ProjectNameChangeService, private packageDetails: PackageDetailsService,
              private messageService: MessageService,private commonService:CommonService) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.packageName = params['packageName'];
      this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      if (this.packageName === this.getLabels().PACKAGE_REATAIN_PROJECT || this.packageName === this.getLabels().PACKAGE_RENEW_PROJECT) {
        this.getProject();
      }
    });

    this.numOfPurchasedBuilding =parseInt( SessionStorageService.getSessionValue(SessionStorage.NO_OF_BUILDINGS_PURCHASED));
    this.totalBilled =parseInt( SessionStorageService.getSessionValue(SessionStorage.TOTAL_BILLED));
    }

  getProject() {
    this.projectService.getProject(this.projectId).subscribe(
      project => this.onGetProjectSuccess(project),
      error => this.onGetProjectFailure(error)
    );
  }

  onGetProjectSuccess(project: any) {
    this.projectModel = project.data[0];
    if (project.data[0].name.includes(this.getLabels().PREFIX_TRIAL_PROJECT)) {
      this.projectModel.name = project.data[0].name.substring(14);
      this.removeTrialProjectPrefix = true;
    } else {
      this.projectModel.name = project.data[0].name;
    }


  }

  onGetProjectFailure(error: any) {
    console.log(error);
  }

  updateProjectNameById() {
    let body = {name: this.projectModel.name};
    this.projectService.updateProjectNameById(this.projectId, body)
      .subscribe(
        user => this.onUpdateProjectNameByIdSuccess(user),
        error => this.onUpdateProjectNameByIdFailure(error));
  }

  onRetainOrRenewProject(packageName: string) {
    let body = {packageName: packageName ,
      numOfPurchasedBuildings: this.numOfPurchasedBuilding,
      totalBilled: this.totalBilled };
    this.packageDetails.getRetainOrRenewProject(this.projectId, body)
      .subscribe(success => this.onRetainOrRenewProjectSuccess(success),
        error => this.onRetainOrRenewProjectFailure(error));
  }

  onRetainOrRenewProjectSuccess(success: any) {
    if (this.packageName === 'Retain' || this.packageName === 'Premium') {
      if (this.removeTrialProjectPrefix) {
        this.removeTrialProjectPrefix = false;
        this.updateProjectNameById();
      }
      sessionStorage.removeItem(SessionStorage.NUMBER_OF_DAYS_TO_EXPIRE);
      var message = new Message();
      message.isError = false;
      message.custom_message = success.data;
      this.messageService.message(message);
      this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
    }
    sessionStorage.removeItem(SessionStorage.TOTAL_BILLED);
  }
    onRetainOrRenewProjectFailure(error:any) {
    console.log(error);
    var message = new Message();
    message.isError = true;
   // message.custom_message = error.err_msg;
    message.error_msg = error.err_msg;
    this.messageService.message(message);
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }
  onUpdateProjectNameByIdSuccess(result: any) {
    if (result !== null) {
      this.projectNameChangeService.change(result.data.name);
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_NAME, result.data.name);
      }
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }

  onUpdateProjectNameByIdFailure(error: any) {
    console.log(error);
  }

  getLabels() {
    return Label;
  }

  assignPremiumPackage() {
    let userId = SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    this.packageDetails.assignPremiumPackage(userId)
      .subscribe(success => this.onAssignPremiumPackageSuccess(success),
        error=>this.onAssignPremiumPackageFailure(error));
  }
  onAssignPremiumPackageSuccess(success: any) {
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }

  onAssignPremiumPackageFailure(error:any) {
    var message = new Message();
    message.isError = true;
    message.custom_message = error.err_msg;
    message.error_msg = error.err_msg;
    this.messageService.message(message);
  }


  onContinue() {
    if (this.packageName === this.getLabels().PACKAGE_REATAIN_PROJECT) {
      this.onRetainOrRenewProject('Premium');
    } else if (this.packageName === this.getLabels().PACKAGE_RENEW_PROJECT) {
      this.onRetainOrRenewProject(this.packageName);
    }else if(this.packageName === this.getLabels().PACKAGE_PREMIUM ) {
      this.assignPremiumPackage();
    }else {
      this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
    }

  }
}
