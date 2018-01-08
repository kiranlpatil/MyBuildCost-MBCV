import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../../../shared/constants';
import { API, BaseService, SessionStorage, SessionStorageService,  Message,
  MessageService } from '../../../../../shared/index';
import { Building } from '../../../model/building';
import { CreateBuildingService } from './create-building.service';
import {ValidationService} from "../../../../../shared/customvalidations/validation.service";
import {SharedService} from "../../../../../shared/services/shared-service";


@Component({
  moduleId: module.id,
  selector: 'bi-add-building-entity',
  templateUrl: 'create-building.component.html'
})

export class CreateBuildingComponent implements OnInit {

  addBuildingForm:  FormGroup;
  buildings : any;
  public isShowErrorMessage: boolean = true;
  public error_msg: boolean = false;
  model: Building = new Building();

  constructor(private createBuildingService: CreateBuildingService, private formBuilder: FormBuilder,
              private _router: Router, private messageService: MessageService,private sharedService: SharedService) {

    this.addBuildingForm = this.formBuilder.group({
      'name': ['', ValidationService.requiredBuildingName],
      'totalSlabArea':['', ValidationService.requiredSlabArea],
      'totalCarperAreaOfUnit':['', ValidationService.requiredCarpetArea],
      'totalParkingAreaOfUnit':['', ValidationService.requiredParkingArea],
      'noOfOneBHK':['', ValidationService.requiredOneBHK],
      'noOfTwoBHK':['', ValidationService.requiredTwoBHK],
      'noOfThreeBHK':['', ValidationService.requiredThreeBHK],
      'noOfSlab':['', ValidationService.requiredNoOfSlabs],
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
    console.log(building);
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
    this.messageService.message(message);
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }

  addBuildingFailed(error : any) {
    console.log(error);
  }

}
