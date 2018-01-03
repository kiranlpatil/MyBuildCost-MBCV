import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../../../../shared/customvalidations/validation.service';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../../shared/constants';
// import { ProjectService } from './project.service';
import { Building } from './../../model/building';
import { CreateBuildingService } from './createBuilding.service';

@Component({
  moduleId: module.id,
  selector: 'bi-add-building-entity',
  templateUrl: 'createBuilding.component.html'
})

export class CreateBuildingComponent implements OnInit {

  addBuildingForm:  FormGroup;
  buildings : any;
  model: Building = new Building();

  constructor(private createBuildingService: CreateBuildingService, private formBuilder: FormBuilder) {

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
    // this.getProjects();
  }

  addBuildingFailed(error : any) {
    console.log(error);
  }

}
