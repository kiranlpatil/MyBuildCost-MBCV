import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Label, NavigationRoutes, ValueConstant } from '../../../../shared/constants';
import { ValidationService } from '../../../../shared/customvalidations/validation.service';
import { Building } from '../../model/building';
import { SessionStorage, SessionStorageService } from '../../../../shared/index';
import { Router } from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'bi-building-form',
  templateUrl: 'building-form.component.html',
  styleUrls: ['building-form.component.css']
})

export class BuildingFormComponent {

  @Input() submitActionLabel: string;
  @Input() buildingModel?:Building= new Building();
  @Output() onSubmitEvent = new EventEmitter<Building>();

  buildingForm:  FormGroup;
  public isShowErrorMessage: boolean = false;
  public errorMessage: boolean = false;
  actionItems:string[]=new Array(0);
  actionItemsArray:string[]=ValueConstant.ACTION_ITEMS;

  private view: string | '';

  constructor( private formBuilder: FormBuilder, private _router: Router) {
    this.actionItems=ValueConstant.ACTION_ITEMS.slice();
    this.view=SessionStorageService.getSessionValue(SessionStorage.CURRENT_VIEW);
    this.buildingForm = this.formBuilder.group({
      name : ['', ValidationService.requiredBuildingName],
      totalSlabArea :['', ValidationService.requiredSlabArea],
      totalCarpetAreaOfUnit :['', ValidationService.requiredCarpetArea],
      totalSaleableAreaOfUnit :['', ValidationService.requiredSalebleArea],
      plinthArea :['', ValidationService.requiredPlinthArea],
      totalNumOfFloors :['', ValidationService.requiredTotalNumOfFloors],
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

  submitForm() {
    if(this.buildingForm.valid) {
      this.buildingModel = this.buildingForm.value;
      this.view==='cloneBuilding'? this.buildingModel.actionItems=this.actionItems:console.log();
      this.onSubmitEvent.emit(this.buildingModel);
    } else {
      this.isShowErrorMessage = true;
    }
  }

  getLabels() {
    return Label;
  }
  selectItem(event:any) {
    if(event.target.checked) {
      this.actionItems.push(event.target.value);
    }else {
      this.actionItems.splice(this.actionItems.indexOf(event.target.value),1);
    }
  }
  navigateTo(navigate:string) {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this._router.navigate([NavigationRoutes.APP_PROJECT,projectId,NavigationRoutes.APP_COST_SUMMARY]);  }
}
