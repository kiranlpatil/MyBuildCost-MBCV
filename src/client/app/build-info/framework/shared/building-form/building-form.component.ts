import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Label } from '../../../../shared/constants';
import { ValidationService } from '../../../../shared/customvalidations/validation.service';
import { Building } from '../../model/building';

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

  constructor( private formBuilder: FormBuilder) {

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
      this.onSubmitEvent.emit(this.buildingModel);
    } else {
      this.isShowErrorMessage = true;
    }
  }

  getLabels() {
    return Label;
  }

}
