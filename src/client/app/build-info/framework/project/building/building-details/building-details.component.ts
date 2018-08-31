import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Messages, Headings, NavigationRoutes, Button} from '../../../../../shared/constants';
import { Building } from './../../../model/building';
import { MessageService } from '../../../../../shared/index';
import { Message } from '../../../../../shared/index';
import { BuildingService } from '../building.service';
import { SessionStorage, SessionStorageService } from '../../../../../shared/index';
import { LoaderService } from '../../../../../shared/loader/loaders.service';

@Component({
  moduleId: module.id,
  selector: 'bi-building-details',
  templateUrl: 'building-details.component.html',
  styleUrls: ['building-details.component.css']
})

export class BuildingDetailsComponent implements OnInit {

  buildingId : string;
  buildingModel: Building = new Building();
  public isShowErrorMessage: boolean = true;
  public errorMessage: boolean = false;

  constructor(private buildingService: BuildingService, private _router: Router,
              private activatedRoute:ActivatedRoute, private messageService: MessageService,
              private loaderService : LoaderService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.buildingId = params['buildingId'];
      if(this.buildingId) {
        this.getBuilding();
      }
    });
  }

  getBuilding() {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.loaderService.start();
    this.buildingService.getBuilding(projectId,this.buildingId).subscribe(
      building => this.onGetBuildingSuccess(building),
      error => this.onGetBuildingFailure(error)
    );
  }

  onGetBuildingSuccess(building : any) {
    this.loaderService.stop();
    this.buildingModel = building.data;
  }

  onGetBuildingFailure(error : any) {
    this.loaderService.stop();
    var message = new Message();

    if (error.err_code === 404 ||error.err_code === 401 || error.err_code === 0) {
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.errorMessage = error.err_msg;
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    }
  }


  updateBuilding(buildingModel : Building) {
    if(this.checkNumberOfFloors(buildingModel.totalNumOfFloors, buildingModel.numOfParkingFloors)) {

      if(this.checkApartmentConfiguration(buildingModel)) {
        this.loaderService.start();
        let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
        let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
        this.buildingService.updateBuilding(projectId, buildingId, buildingModel)
          .subscribe(
            building => this.updateBuildingSuccess(building),
            error => this.updateBuildingFailure(error));
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

  updateBuildingSuccess(result: any) {
    this.loaderService.stop();
    if (result !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_UPDATE_BUILDING_DETAILS;
      this.messageService.message(message);
    }
  }

  updateBuildingFailure(error: any) {

    var message = new Message();
    this.loaderService.stop();
    if (error.err_code === 404 ||error.err_code === 401 || error.err_code === 0) {
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.errorMessage = error.err_msg;
      message.error_msg = error.err_msg;
      message.isError = true;
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

  getHeadings() {
    return Headings;
  }

  goBack() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this._router.navigate([NavigationRoutes.APP_PROJECT,projectId,NavigationRoutes.APP_COST_SUMMARY]);
  }

  getButton() {
    return Button;
  }
}
