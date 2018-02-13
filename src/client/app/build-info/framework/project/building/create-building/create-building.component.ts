import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AppSettings, Messages, Label, Button, Headings, NavigationRoutes,
  ImagePath
} from '../../../../../shared/constants';
import { API, BaseService, SessionStorage, SessionStorageService,  Message,
  MessageService } from '../../../../../shared/index';
import { Building } from '../../../model/building';
import { CreateBuildingService } from './create-building.service';
import { ValidationService } from '../../../../../shared/customvalidations/validation.service';
import { SharedService } from '../../../../../shared/services/shared-service';


@Component({
  moduleId: module.id,
  selector: 'bi-add-building-entity',
  templateUrl: 'create-building.component.html',
  styleUrls: ['create-building.component.css'],
})

export class CreateBuildingComponent implements OnInit {

  addBuildingForm:  FormGroup;
  buildings : any;
  public isShowErrorMessage: boolean = true;
  public error_msg: boolean = false;
  model: Building = new Building();
  BODY_BACKGROUND_TRANSPARENT: string;

  constructor(private createBuildingService: CreateBuildingService, private formBuilder: FormBuilder,
              private _router: Router, private messageService: MessageService,private sharedService: SharedService) {
    this.BODY_BACKGROUND_TRANSPARENT = ImagePath.BODY_BACKGROUND_TRANSPARENT;
    this.addBuildingForm = this.formBuilder.group({
      'name': ['', ValidationService.requiredBuildingName],
      'totalSlabArea':['', ValidationService.requiredSlabArea],
      'totalCarperAreaOfUnit':['', ValidationService.requiredCarpetArea],
      'totalSaleableAreaOfUnit':['', ValidationService.requiredSalebleArea],
      'plinthArea':['', ValidationService.requiredPlinthArea],
      'totalNoOfFloors':['', ValidationService.requiredNoOfFloors],
      'noOfParkingFloors':['', ValidationService.requiredNoOfParkingFloors],
      'carpetAreaOfParking':['', ValidationService.requiredCarpetAreaOfParking],
      'noOfOneBHK': ['',  ValidationService.requiredOneBHK],
      'noOfTwoBHK':['', ValidationService.requiredTwoBHK],
      'noOfThreeBHK':['', ValidationService.requiredThreeBHK],
      'noOfFourBHK':['', ValidationService.requiredFourBHK],
      'noOfFiveBHK':['', ValidationService.requiredFiveBHK],
      'noOfLift':['', ValidationService.requiredNoOfLifts],
   });

  }

  ngOnInit() {
    // // this.getProjects();
  }

  onSubmit() {
    //this.projectService
    if(this.addBuildingForm.valid) {
      this.model = this.addBuildingForm.value;
      this.createBuildingService.addBuilding(this.model)
        .subscribe(
          building => this.addBuildingSuccess(building),
          error => this.addBuildingFailed(error));
    }
  }

  addBuildingSuccess(building : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
    this.messageService.message(message);
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    this._router.navigate([NavigationRoutes.APP_COST_SUMMARY, projectId]);
  }

  addBuildingFailed(error : any) {
    console.log(error);
  }

}
