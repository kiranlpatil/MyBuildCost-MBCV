import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Messages, NavigationRoutes, ImagePath, Headings, Button } from '../../../../../shared/constants';
import { SessionStorage, SessionStorageService,  Message,
  MessageService } from '../../../../../shared/index';
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
  public isUserSignIn:number;
  private cloneBuildingModel: Building;
  constructor(private buildingService: BuildingService,private activatedRoute: ActivatedRoute,
              private loaderService: LoaderService,
              private _router: Router, private messageService: MessageService) {
    this.BODY_BACKGROUND_TRANSPARENT = ImagePath.BODY_BACKGROUND_TRANSPARENT;
  }
  ngOnInit() {
    this.isUserSignIn = parseFloat(SessionStorageService.getSessionValue(SessionStorage.IS_USER_SIGN_IN));
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_VIEW,'cloneBuilding');
      let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
        this.getBuildingDetails(projectId,buildingId);
  }
   getBuildingDetails(projectId:string,buildingId:string) {
    this.buildingService.getBuildingDetailsForClone(projectId, buildingId).subscribe(
      building => this.onGetBuildingDetailsForCloneSuccess(building),
      error => this.onGetBuildingDetailsForCloneFailure(error)
    );
  }
  goBack() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this._router.navigate([NavigationRoutes.APP_PROJECT,projectId,NavigationRoutes.APP_COST_SUMMARY]);
  }

  onSubmit(buildingModel : Building) {
    if(this.checkNumberOfFloors(buildingModel.totalNumOfFloors, buildingModel.numOfParkingFloors)) {
      if(this.checkApartmentConfiguration(buildingModel)) {
        this.loaderService.start();
        let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
        let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
        this.buildingService.cloneBuildingCostHeads(projectId,buildingId, buildingModel)
          .subscribe(
            building => this.onCreateBuildingSuccess(building),
            error => this.onCreateBuildingFailure(error));
      } else {
          var message = new Message();
          message.isError = false;
          message.custom_message = Messages.MSG_ERROR_VALIDATION_ADD_AT_LEAST_ONE_APARTMENT_CONFIGURATION;
          this.messageService.message(message);
      }
    } else {
      message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_ERROR_VALIDATION_NUMBER_OF_FLOORS;
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
    this.loaderService.stop();
  }
  onCreateBuildingFailure(error : any) {
    console.log(error);
    this.loaderService.stop();
  }

  getHeadings() {
    return Headings;
  }

  getButton() {
    return Button;
  }

  onGetBuildingDetailsForCloneSuccess(building: any) {
    this.cloneBuildingModel = building.data;
    this.cloneBuildingModel.name = '';
  }

  onGetBuildingDetailsForCloneFailure(error: any) {
    console.log(error);
  }
}
