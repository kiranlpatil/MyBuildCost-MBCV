import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Messages, NavigationRoutes, ImagePath, Headings, Button, ScrollView } from '../../../../../shared/constants';
import { SessionStorage, SessionStorageService,  Message,
  MessageService } from '../../../../../shared/index';
import { Building } from '../../../model/building';
import { Project } from '../../../model/project';
import { BuildingService } from './../building.service';
import { LoaderService } from '../../../../../shared/loader/loaders.service';

declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'bi-create-building',
  templateUrl: 'create-building.component.html',
  styleUrls: ['create-building.component.css'],
})

export class CreateBuildingComponent  implements  OnInit {

  BODY_BACKGROUND_TRANSPARENT: string;
  public isUserSignIn:number;

  constructor(private buildingService: BuildingService, private loaderService: LoaderService,
              private _router: Router, private messageService: MessageService) {
    this.BODY_BACKGROUND_TRANSPARENT = ImagePath.BODY_BACKGROUND_TRANSPARENT;
  }
  ngOnInit() {
    this.isUserSignIn = parseFloat(SessionStorageService.getSessionValue(SessionStorage.IS_USER_SIGN_IN));
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_VIEW,'createBuilding');
  }
  goBack() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    if(this.isUserSignIn === 1) {
      window.history.back();
    } else {
      this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
    }
    sessionStorage.removeItem(SessionStorage.CURRENT_VIEW);
  //  this._router.navigate([NavigationRoutes.APP_PROJECT,projectId,NavigationRoutes.APP_COST_SUMMARY]);
  }

  onSubmit(buildingModel : Building) {
    if(this.checkNumberOfFloors(buildingModel.totalNumOfFloors, buildingModel.numOfParkingFloors)) {

      if(this.checkApartmentConfiguration(buildingModel)) {
        this.loaderService.start();
        let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
        this.buildingService.createBuilding(projectId, buildingModel)
          .subscribe(
            building => this.onCreateBuildingSuccess(building),
            error => this.onCreateBuildingFailure(error));
      } else {
          var message = new Message();
          message.isError = true;
          message.error_msg = Messages.MSG_ERROR_VALIDATION_ADD_AT_LEAST_ONE_APARTMENT_CONFIGURATION;
          this.messageService.message(message);
      }

    } else {
      message = new Message();
      message.isError = true;
      message.error_msg = Messages.MSG_ERROR_VALIDATION_NUMBER_OF_FLOORS;
      this.messageService.message(message);
    }
  }

  checkNumberOfFloors(totalNumOfFloors : number, numOfParkingFloors : number) {
    if(totalNumOfFloors > numOfParkingFloors) {
      return true;
    } else {
      return false;
    }
  }

  checkApartmentConfiguration(buildingModel : Building) {
    if((buildingModel.numOfOneBHK !== 0 && buildingModel.numOfOneBHK !== null) ||
      (buildingModel.numOfTwoBHK  !== 0 && buildingModel.numOfTwoBHK !== null) ||
      (buildingModel.numOfThreeBHK !== 0 && buildingModel.numOfThreeBHK !== null) ||
      (buildingModel.numOfFourBHK !== 0 && buildingModel.numOfFourBHK !== null) ||
      (buildingModel.numOfFiveBHK !== 0 && buildingModel.numOfFiveBHK !== null)) {
      return true;
    } else {
      return false;
    }
  }

  onCreateBuildingSuccess(building : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
    this.messageService.message(message);
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);

    this.buildingService.syncBuildingWithRateAnalysis(projectId, building.data._id).subscribe(
      project => this.onSyncBuildingWithRateAnalysisSuccess(project),
      error => this.onSyncBuildingWithRateAnalysisFailure(error));
  }

  onSyncBuildingWithRateAnalysisSuccess(project : any) {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    SessionStorageService.setSessionValue(SessionStorage.FROM_VIEW, this.getScrollView().GO_TO_RECENT_BUILDING);
    this.loaderService.stop();
    this._router.navigate([NavigationRoutes.APP_PROJECT, projectId, NavigationRoutes.APP_COST_SUMMARY]);
  }

  onSyncBuildingWithRateAnalysisFailure(error:any) {
    console.log(error);
    this.loaderService.stop();
  }

  onCreateBuildingFailure(error : any) {
    var message = new Message();
    message.isError = true;
    message.custom_message = error.err_msg;
    message.error_msg = error.err_msg;
    this.messageService.message(message);
    this.loaderService.stop();
  }

  getHeadings() {
    return Headings;
  }

  getButton() {
    return Button;
  }

  getScrollView() {
    return ScrollView;
  }
}
