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
  createNewProject :boolean =false;
  constructor(private activatedRoute:ActivatedRoute, private _router: Router,
              private projectService: ProjectService,private commonService:CommonService) {

    }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectName = params['projectName'];
      /*if(this.projectName && (this.projectName.indexOf('Trial Project'))!== -1) {
        this.createNewProject=true;
        SessionStorageService.setSessionValue(SessionStorage.CREATE_NEW_PROJECT,this.createNewProject);
        }*/
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
      if(this.isSubscriptionAvailable) {
        this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
      }else if(!this.isSubscriptionAvailable) {
        this._router.navigate([NavigationRoutes.APP_PACKAGE_SUMMARY,this.packageName,this.premiumPackageAvailable]);
      }
    }



  onContinueWithExixtingProject() {
    this._router.navigate([NavigationRoutes.APP_PACKAGE_SUMMARY,'Retain',false]);

  }
}
