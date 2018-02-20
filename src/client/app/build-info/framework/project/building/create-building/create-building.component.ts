import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Messages, NavigationRoutes, ImagePath } from '../../../../../shared/constants';
import { SessionStorage, SessionStorageService,  Message,
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

export class CreateBuildingComponent {

  addBuildingForm:  FormGroup;
  buildings : any;
  public isShowErrorMessage: boolean = true;
  public error_msg: boolean = false;
  modelBuilding: Building = new Building();
  BODY_BACKGROUND_TRANSPARENT: string;

  constructor(private createBuildingService: CreateBuildingService, private formBuilder: FormBuilder,
              private _router: Router, private messageService: MessageService,private sharedService: SharedService) {
    this.BODY_BACKGROUND_TRANSPARENT = ImagePath.BODY_BACKGROUND_TRANSPARENT;
    this.addBuildingForm = this.formBuilder.group({
      name : ['', ValidationService.requiredBuildingName],
      totalSlabArea :['', ValidationService.requiredSlabArea],
      totalCarpetAreaOfUnit :['', ValidationService.requiredCarpetArea],
      totalSaleableAreaOfUnit :['', ValidationService.requiredSalebleArea],
      plinthArea :['', ValidationService.requiredPlinthArea],
      totalNumOfFloors :['', ValidationService.requiredNumOfFloors],
      numOfParkingFloors :['', ValidationService.requiredNumOfParkingFloors],
      carpetAreaOfParking :['', ValidationService.requiredCarpetAreaOfParking],
      numOfOneBHK : [''],
      numOfTwoBHK :[''],
      numOfThreeBHK :[''],
      numOfFourBHK :[''],
      numOfFiveBHK :[''],
      numOfLifts :['']
   });

  }

  goBack() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    this._router.navigate([NavigationRoutes.APP_PROJECT,projectId,NavigationRoutes.APP_COST_SUMMARY]);
  }
  onSubmit() {
    if(this.addBuildingForm.valid) {
      this.modelBuilding = this.addBuildingForm.value;
      if(this.modelBuilding.numOfOneBHK !== undefined || this.modelBuilding.numOfTwoBHK !== undefined
        || this.modelBuilding.numOfThreeBHK !== undefined ||
        this.modelBuilding.numOfFourBHK !== undefined || this.modelBuilding.numOfFiveBHK !== undefined ) {

        if(this.modelBuilding.numOfOneBHK === undefined) {
          this.modelBuilding.numOfOneBHK=0;
        }

        if(this.modelBuilding.numOfTwoBHK === undefined) {
          this.modelBuilding.numOfTwoBHK=0;
        }

        if(this.modelBuilding.numOfThreeBHK === undefined) {
          this.modelBuilding.numOfThreeBHK=0;
        }

        if(this.modelBuilding.numOfFourBHK === undefined) {
          this.modelBuilding.numOfFourBHK=0;
        }

        if(this.modelBuilding.numOfFiveBHK === undefined) {
          this.modelBuilding.numOfFiveBHK=0;
        }

        if(this.modelBuilding.numOfLifts === undefined) {
          this.modelBuilding.numOfLifts=0;
        }

      this.createBuildingService.addNewBuilding(this.modelBuilding)
        .subscribe(
          building => this.onAddNewBuildingSuccess(building),
          error => this.onAddNewBuildingFailure(error));
      } else {
        var message = new Message();
        message.isError = false;
        message.custom_message = 'Add at leat one Apartment Configuration';
        this.messageService.message(message);
      }
    }
  }

  onAddNewBuildingSuccess(building : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
    this.messageService.message(message);
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    this._router.navigate([NavigationRoutes.APP_PROJECT, projectId, NavigationRoutes.APP_COST_SUMMARY]);
  }

  onAddNewBuildingFailure(error : any) {
    console.log(error);
  }

}
