import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Building } from '../../model/building';
import { BuildingService } from './building.service';

@Component({
  moduleId: module.id,
  selector: 'bi-building',
  templateUrl: 'building.component.html'
})

export class BuildingComponent {

  addBuildingForm:  FormGroup;
  buildings : any;
  model: Building = new Building();

  constructor(private buildingService: BuildingService, private formBuilder: FormBuilder) {

    this.addBuildingForm = this.formBuilder.group({
      'name': '',
      'totalSlabArea':'',
      'totalCarperAreaOfUnit':'',
      'totalParkingAreaOfUnit':'',
      'noOfOneBHK':'',
      'noOfTwoBHK':'',
      'noOfThreeBHK':'',
      'noOfSlab':'',
      'noOfLift':'',
    });

  }

  onSubmit() {
    if(this.addBuildingForm.valid) {
      this.model = this.addBuildingForm.value;
      this.buildingService.addBuilding(this.model)
        .subscribe(
          building => this.onAddBuildingSuccess(building),
          error => this.onAddBuildingFailure(error));
    }
  }

  onAddBuildingSuccess(building : any) {
    console.log(building);
  }

  onAddBuildingFailure(error : any) {
    console.log(error);
  }

}
