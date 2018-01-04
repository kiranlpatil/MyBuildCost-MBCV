import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from '../../../../shared/customvalidations/validation.service';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../../shared/constants';
import { API, BaseService, SessionStorage, SessionStorageService,  Message,
  MessageService } from '../../../../shared/index';
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
  public isShowErrorMessage: boolean = true;
  public error_msg: boolean = false;

  model: Building = new Building();

  constructor(private createBuildingService: CreateBuildingService, private formBuilder: FormBuilder,
              private _router: Router, private messageService: MessageService) {

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
