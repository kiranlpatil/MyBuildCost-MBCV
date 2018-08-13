import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Messages, NavigationRoutes, ImagePath, Headings, Button, Menus,
  ScrollView
} from '../../../../../shared/constants';
import { SessionStorage, SessionStorageService, Message, MessageService,} from '../../../../../shared/index';
import { Building } from '../../../model/building';
import { BuildingService } from './../building.service';
import { LoaderService } from '../../../../../shared/loader/loaders.service';
@Component({
  moduleId: module.id,
  selector: 'bi-clone-building',
  templateUrl: 'clone-building.component.html',
  styleUrls: ['clone-building.component.css'],
})

export class CloneBuildingComponent  implements  OnInit {

  BODY_BACKGROUND_TRANSPARENT: string;
  cloneBuildingModel: Building;
  public isUserSignIn:number;
  buildingId:string;
  oldBuildingName: string;
  disableFormFields: boolean = false;



  constructor(private buildingService: BuildingService,
              private loaderService: LoaderService,
              private _router: Router, private messageService: MessageService) {
    this.BODY_BACKGROUND_TRANSPARENT = ImagePath.BODY_BACKGROUND_TRANSPARENT;
  }

  ngOnInit() {
    this.isUserSignIn = parseFloat(SessionStorageService.getSessionValue(SessionStorage.IS_USER_SIGN_IN));
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_VIEW,'cloneBuilding');
    this.buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    this.fetchBuilding();
  }
  fetchBuilding() {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.loaderService.start();
    this.buildingService.getBuilding(projectId,this.buildingId).subscribe(
      building => this.onGetBuildingSuccess(building),
      error => this.onGetBuildingFailure(error)
    );
  }

  onGetBuildingSuccess(building : any) {
    this.cloneBuildingModel = building.data;
    this.disableFormFields = true;
    this.oldBuildingName = this.cloneBuildingModel.name;
    this.cloneBuildingModel.name = '';
    this.loaderService.stop();
  }

  onGetBuildingFailure(error : any) {
    let message = new Message();
    this.loaderService.stop();
    if (error.err_code === 404 || error.err_code === 0) {
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    } else {
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    }
  }

  goBack() {
    window.history.back();
  }

  onSubmit(buildingModel : Building) {
    if(this.oldBuildingName!==buildingModel.name) {
      if (this.checkNumberOfFloors(buildingModel.totalNumOfFloors, buildingModel.numOfParkingFloors)) {
        if (this.checkApartmentConfiguration(buildingModel)) {
          this.loaderService.start();
          let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
          let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
          this.buildingService.cloneBuilding(projectId, buildingId, buildingModel)
            .subscribe(
              building => this.onCloneBuildingSuccess(building),
              error => this.onCloneBuildingFailure(error));
        } else {
          let message = new Message();
          message.isError = true;
          message.error_msg = Messages.MSG_ERROR_VALIDATION_ADD_AT_LEAST_ONE_APARTMENT_CONFIGURATION;
          this.messageService.message(message);
        }


      } else {
        let message = new Message();
        message.isError = true;
        message.error_msg = Messages.MSG_ERROR_VALIDATION_NUMBER_OF_FLOORS;
        this.messageService.message(message);
      }
    }else {
      let message = new Message();
      message.isError = true;
      message.error_msg = Messages.MSG_ERROR_VALIDATION_SAME_BUILDING_NAME;
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

  onCloneBuildingSuccess(building : Building) {
    let message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_COPY_BUILDING_PROJECT;
    this.messageService.message(message);
    SessionStorageService.setSessionValue(SessionStorage.FROM_VIEW, this.getScrollView().GO_TO_RECENT_BUILDING);

    this.loaderService.stop();
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this._router.navigate([NavigationRoutes.APP_PROJECT, projectId, NavigationRoutes.APP_COST_SUMMARY]);
  }

  onCloneBuildingFailure(error : any) {
    let message = new Message();
    if (error.err_code === 404 || error.err_code === 0) {
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    } else {
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    }
    this.loaderService.stop();
  }

  getHeadings() {
    return Headings;
  }

  getButton() {
    return Button;
  }

  getMenus() {
    return Menus;
  }
  getScrollView() {
    return ScrollView;
  }
}
