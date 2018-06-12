import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { Headings, Button, Label,Messages } from '../../../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import {CommonService, NavigationRoutes} from '../../../../shared/index';
import { SessionStorage, SessionStorageService } from '../../../../shared/index';
import { ProjectService } from '../../project/project.service';
import {Subscribable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";

@Component({
  moduleId: module.id,
  selector: 'bi-retain-project',
  templateUrl: 'retain-project.component.html',
  styleUrls: ['retain-project.component.css']
})

export class RetainProjectComponent implements OnInit {
  projectName:string;
  isSubscriptionAvailable:boolean;
  packageName:string;
  premiumPackageAvailable:boolean;
  retainDetails:Subscription;

  constructor(private activatedRoute:ActivatedRoute, private _router: Router,
              private projectService: ProjectService,private commonService:CommonService) {

    }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectName = params['projectName'];
    });
    this.packageName=SessionStorageService.getSessionValue(SessionStorage.PACKAGE_NAME);
    this.premiumPackageAvailable=SessionStorageService.getSessionValue(SessionStorage.PREMIUM_PACKAGE_AVAILABLE)!== 'false' ? true : false;
    this.isSubscriptionAvailable=SessionStorageService.getSessionValue(SessionStorage.IS_SUBSCRIPTION_AVAILABLE)!== 'false' ? true : false;
    }
  getMessage() {
    return Messages;
    }

    getButton() {
    return Button;
    }

    onCreateNewProject() {
      let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      this.projectService.updateProjectStatus(projectId).subscribe(
        success => this.onUpdateProjectStatusSuccess(success),
        error => this.onUpdateProjectStatusFailure(error)
      );
      }

  onUpdateProjectStatusSuccess(success : any) {
    if(this.isSubscriptionAvailable) {
      this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
    }else if(!this.isSubscriptionAvailable) {
      this._router.navigate([NavigationRoutes.APP_PACKAGE_SUMMARY,'Premium',this.premiumPackageAvailable]);

    }
    console.log(success);
  }

  onUpdateProjectStatusFailure(error : any) {
    console.log(error);
  }

  onContinueWithExixtingProject() {
    this._router.navigate([NavigationRoutes.APP_PACKAGE_SUMMARY,'Retain',false]);

  }
}
