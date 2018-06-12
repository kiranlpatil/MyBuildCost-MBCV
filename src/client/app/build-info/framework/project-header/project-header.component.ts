import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { SessionStorage, SessionStorageService } from '../../../shared/index';
import { Menus, NavigationRoutes, CurrentView, Button } from '../../../shared/constants';
import { CostSummaryService } from '../project/cost-summary-report/cost-summary.service';

@Component({
  moduleId: module.id,
  selector: 'bi-project-header',
  templateUrl: 'project-header.component.html',
  styleUrls:['./project-header.component.css']
})

export class ProjectHeaderComponent implements OnInit {

  @Input() isClassVisible: boolean;
  @Output() toggleClassView = new EventEmitter<boolean>();
  @Input () isActiveAddBuildingButton?:boolean;
  numberOfRemainingBuildings : number;
  subscriptionValidityMessage : string;
  premiumPackageExist:any;
  premiumPackageAvailable:boolean=false;


  constructor(private _router: Router,private activatedRoute:ActivatedRoute, private costSummaryService : CostSummaryService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params=> {
      this.premiumPackageExist=params['premiumPackageExist'];
      this.premiumPackageAvailable = this.premiumPackageExist!=='false'?true:false;
      });

    this.getCurrentProjectId();
    this.getProjectSubscriptionDetails();

  }

  getCurrentProjectId() {
    return SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
  }

  getProjectSubscriptionDetails () {
    let userId = SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.costSummaryService.checkLimitationOfBuilding(userId, projectId).subscribe(
      status=>this.checkLimitationOfBuildingSuccess(status),
      error=>this.checkLimitationOfBuildingFailure(error)
    );
  }

  goToCreateBuilding() {
    if(this.numberOfRemainingBuildings > 0) {
      this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
    } else {
      //change package name with addOn packages
      let packageName = 'Add_building';
      this._router.navigate([NavigationRoutes.APP_PACKAGE_SUMMARY, packageName,this.premiumPackageAvailable]);
    }
  }

  checkLimitationOfBuildingSuccess(status:any) {
    this.numberOfRemainingBuildings = status.numOfBuildingsRemaining;
    if(status.expiryMessage) {
      this.subscriptionValidityMessage = status.expiryMessage;
    } else if(status.warningMessage) {
      this.subscriptionValidityMessage = status.warningMessage;
    }
  }

  checkLimitationOfBuildingFailure(error:any) {
    console.log(error);
  }

  getMenus() {
    return Menus;
  }

  getCurrentView() {
    return SessionStorageService.getSessionValue(SessionStorage.CURRENT_VIEW);
  }

  currentView() {
    return CurrentView;
  }

  closeMenu() {
    this.toggleClassView.emit(false);
  }

  getButton() {
    return Button;
  }

  goToRenew() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let projectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
    let numberOfDaysToExpire = SessionStorageService.getSessionValue(SessionStorage.NUMBER_OF_DAYS_TO_EXPIRE);
    this._router.navigate([NavigationRoutes.APP_RENEW_PACKAGE, projectId, projectName, numberOfDaysToExpire]);
  }

}
