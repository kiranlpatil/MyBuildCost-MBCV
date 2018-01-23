import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Messages } from '../../../../../shared/constants';
import { BuildingDetailsService } from './building-details.service';
import { Building } from './../../../model/building';
import { MessageService } from '../../../../../shared/index';
import { Message } from '../../../../../shared/index';
import { ValidationService } from '../../../../../shared/customvalidations/validation.service';

@Component({
  moduleId: module.id,
  selector: 'bi-view-building',
  templateUrl: 'building-details.component.html'
})

export class BuildingDetailsComponent implements OnInit {

  viewBuildingForm:  FormGroup;
  buildings : any;
  buildingId : string;
  model: Building = new Building();
  public isShowErrorMessage: boolean = true;
  public error_msg: boolean = false;

  constructor(private viewBuildingService: BuildingDetailsService, private _router: Router, private formBuilder: FormBuilder,
              private activatedRoute:ActivatedRoute, private messageService: MessageService) {

    this.viewBuildingForm = this.formBuilder.group({
      'name': ['', ValidationService.requiredBuildingName],
      'totalSlabArea':['', ValidationService.requiredSlabArea],
      'totalCarperAreaOfUnit':['', ValidationService.requiredCarpetArea],
      'totalSaleableAreaOfUnit':['', ValidationService.requiredSalebleArea],
      'totalParkingAreaOfUnit':['', ValidationService.requiredParkingArea],
      'noOfOneBHK':['', ValidationService.requiredOneBHK],
      'noOfTwoBHK':['', ValidationService.requiredTwoBHK],
      'noOfThreeBHK':['', ValidationService.requiredThreeBHK],
      'noOfSlab':['', ValidationService.requiredNoOfSlabs],
      'noOfLift':['', ValidationService.requiredNoOfLifts],
    });

  }

  ngOnInit() {
    console.log('Building details');
    this.activatedRoute.params.subscribe(params => {
      this.buildingId = params['buildingId'];
      if(this.buildingId) {
        this.getBuildingDetails();
      }
    });
  }

  getBuildingDetails() {
    this.viewBuildingService.getBuildingDetails(this.buildingId).subscribe(
      building => this.onGetBuildingSuccess(building),
      error => this.onGetBuildingFail(error)
    );
  }

  onGetBuildingSuccess(building : any) {
    console.log('Building Data: '+JSON.stringify(building.data));
    let buildingDetails=building.data;
    this.model.name=buildingDetails.name;
    this.model.totalSlabArea=buildingDetails.totalSlabArea;
    this.model.totalCarperAreaOfUnit=buildingDetails.totalCarperAreaOfUnit;
    this.model.totalSaleableAreaOfUnit=buildingDetails.totalSaleableAreaOfUnit;
    this.model.totalParkingAreaOfUnit=buildingDetails.totalParkingAreaOfUnit;
    this.model.noOfOneBHK=buildingDetails.noOfOneBHK;
    this.model.noOfTwoBHK=buildingDetails.noOfTwoBHK;
    this.model.noOfThreeBHK=buildingDetails.noOfThreeBHK;
    this.model.noOfSlab=buildingDetails.noOfSlab;
    this.model.noOfLift=buildingDetails.noOfLift;
    }

  onGetBuildingFail(error : any) {
    console.log(error);
  }


  onSubmit() {
    // this.submitted = true;
      this.model = this.viewBuildingForm.value;
      this.viewBuildingService.updateBuildingDetails(this.model)
        .subscribe(
          building => this.updateBuildingDetailsSuccess(building),
          error => this.updateBuildingDetailsError(error));
  }

  updateBuildingDetailsSuccess(result: any) {

    if (result !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_UPDATE_BUILDING_DETAILS;
      this.messageService.message(message);
    }
  }

  updateBuildingDetailsError(error: any) {

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

  // getMessages() {
  //   return Messages;
  // }
  //
  // getLabels() {
  //   return Label;
  // }
  //
  // getButtons() {
  //   return Button;
  // }
  //
  // getHeadings() {
  //   return Headings;
  // }
}
