import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Messages } from '../../../../../shared/constants';
import { Building } from './../../../model/building';
import { MessageService } from '../../../../../shared/index';
import { Message } from '../../../../../shared/index';
import { ValidationService } from '../../../../../shared/customvalidations/validation.service';
import { BuildingService } from '../building.service';

@Component({
  moduleId: module.id,
  selector: 'bi-edit-building',
  templateUrl: 'building-details.component.html'
})

export class BuildingDetailsComponent implements OnInit {

  viewBuildingForm:  FormGroup;
  buildings : any;
  buildingId : string;
  buildingModel: Building = new Building();
  public isShowErrorMessage: boolean = true;
  public error_msg: boolean = false;

  constructor(private buildingService: BuildingService, private _router: Router, private formBuilder: FormBuilder,
              private activatedRoute:ActivatedRoute, private messageService: MessageService) {

    this.viewBuildingForm = this.formBuilder.group({
      name: ['', ValidationService.requiredBuildingName],
      totalSlabArea:['', ValidationService.requiredSlabArea],
      totalCarpetAreaOfUnit:['', ValidationService.requiredCarpetArea],
      totalSaleableAreaOfUnit:['', ValidationService.requiredSalebleArea],
      plinthArea:['', ValidationService.requiredPlinthArea],
      totalNumOfFloors :['', ValidationService.requiredTotalNumOfFloors],
      numOfParkingFloors :['', ValidationService.requiredNumOfParkingFloors],
      carpetAreaOfParking :['', ValidationService.requiredCarpetAreaOfParking],
      numOfOneBHK : ['',  ValidationService.requiredOneBHK],
      numOfTwoBHK : ['', ValidationService.requiredTwoBHK],
      numOfThreeBHK : ['', ValidationService.requiredThreeBHK],
      numOfFourBHK : ['', ValidationService.requiredFourBHK],
      numOfFiveBHK : ['', ValidationService.requiredFiveBHK],
      numOfLifts : ['', ValidationService.requiredNumOfLifts]
    });

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.buildingId = params['buildingId'];
      if(this.buildingId) {
        this.getBuildingDetails();
      }
    });
  }

  getBuildingDetails() {
    this.buildingService.getBuilding(this.buildingId).subscribe(
      building => this.onGetBuildingSuccess(building),
      error => this.onGetBuildingFailure(error)
    );
  }

  onGetBuildingSuccess(building : any) {
    let buildingDetails = building.data;
    this.buildingModel.name = buildingDetails.name;
    this.buildingModel.totalSlabArea = buildingDetails.totalSlabArea;
    this.buildingModel.totalCarpetAreaOfUnit = buildingDetails.totalCarpetAreaOfUnit;
    this.buildingModel.totalSaleableAreaOfUnit = buildingDetails.totalSaleableAreaOfUnit;
    this.buildingModel.plinthArea = buildingDetails.plinthArea;
    this.buildingModel.totalNumOfFloors = buildingDetails.totalNumOfFloors;
    this.buildingModel.numOfParkingFloors = buildingDetails.numOfParkingFloors;
    this.buildingModel.carpetAreaOfParking = buildingDetails.carpetAreaOfParking;
    this.buildingModel.numOfOneBHK = buildingDetails.numOfOneBHK;
    this.buildingModel.numOfTwoBHK = buildingDetails.numOfTwoBHK;
    this.buildingModel.numOfThreeBHK = buildingDetails.numOfThreeBHK;
    this.buildingModel.numOfFourBHK = buildingDetails.numOfFourBHK;
    this.buildingModel.numOfFiveBHK = buildingDetails.numOfFiveBHK;
    this.buildingModel.numOfLifts = buildingDetails.numOfLifts;
    }

  onGetBuildingFailure(error : any) {
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


  onSubmit() {
      this.buildingModel = this.viewBuildingForm.value;
      this.buildingService.updateBuilding(this.buildingModel)
        .subscribe(
          building => this.updateBuildingSuccess(building),
          error => this.updateBuildingFailure(error));
  }

  updateBuildingSuccess(result: any) {

    if (result !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_UPDATE_BUILDING_DETAILS;
      this.messageService.message(message);
    }
  }

  updateBuildingFailure(error: any) {

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
