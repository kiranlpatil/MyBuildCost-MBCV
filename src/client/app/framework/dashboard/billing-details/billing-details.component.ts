import { Component, OnInit } from '@angular/core';
import { Messages, SessionStorage, SessionStorageService } from '../../../shared/index';
import { Button, Label, NavigationRoutes } from '../../../shared/constants';
import { Router } from '@angular/router';
import { ProjectService } from '../../../build-info/framework/project/project.service';
import { ProjectSubscriptionDetails } from '../../../build-info/framework/model/projectSubscriptionDetails';

@Component({
  moduleId: module.id,
  selector: 'billing-details',
  templateUrl: 'billing-details.component.html',
  styleUrls: ['billing-details.component.css'],
})

 export class BillingDetailsComponent implements OnInit {

  currentPackage:string;
  projectDetails : Array<ProjectSubscriptionDetails>;
  isAbleToCreateNewProject: boolean = false;
  activeStatus: boolean = false;
  constructor(private _router: Router, private  projectService: ProjectService) {

  }
  ngOnInit() {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_VIEW,'accountSummary');
    this.getDetailsOfProjectPlan();
  }

  getDetailsOfProjectPlan() {
    this.projectService.getAllProjects().subscribe(
      projects => this.onDetailsOfProjectPlanSuccess(projects),
      error => this.onDetailsOfProjectPlanFailure(error)
    );
  }

  onDetailsOfProjectPlanSuccess(projects : any) {
    this.projectDetails = projects.data;
    this.isAbleToCreateNewProject = projects.isSubscriptionAvailable;
    this.currentPackage = projects.data[0].packageName;
    this.activeStatus = projects.data[0].activeStatus;
  }

  onDetailsOfProjectPlanFailure(error:any) {
    console.log(error);
  }

    getLabel() {
    return Label;
  }

  getButton() {
    return Button;
  }
  getMessage() {
    return Messages;
  }

  goBack() {
    sessionStorage.removeItem(SessionStorage.CURRENT_VIEW);
    window.history.back();
    return false;
  }

   createProject() {
     if(this.isAbleToCreateNewProject) {
       this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
     }else {
      let premiumPackageAvailable = SessionStorageService.getSessionValue(SessionStorage.PREMIUM_PACKAGE_AVAILABLE)!== 'false' ? true : false;
      if(premiumPackageAvailable) {
        this._router.navigate([NavigationRoutes.APP_PACKAGE_SUMMARY,'Premium',true]);
      }else {
        this._router.navigate([NavigationRoutes.APP_PACKAGE_SUMMARY,'Premium',false]);
      }
     }
    }

  goToRenew(projectId:string, projectName:string, numOfDaysToExpire : number) {
    this._router.navigate([NavigationRoutes.APP_RENEW_PACKAGE, projectId, projectName, numOfDaysToExpire]);
  }
}
