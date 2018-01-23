import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../../../shared/constants';
import { BuildingListService } from './building-list.service';
import { BuildingDetailsService } from '../building-details/building-details.service';
import { Building } from '../../../model/building';
import { SessionStorage, SessionStorageService,MessageService } from '../../../../../shared/index';
import { Message } from '../../../../../shared/index';
import { CreateBuildingService } from '../create-building/create-building.service';
import { ValidationService } from '../../../../../shared/customvalidations/validation.service';

@Component({
  moduleId: module.id,
  selector: 'bi-list-building',
  templateUrl: 'building-list.component.html'
})

export class BuildingListComponent implements OnInit {

  buildings : any;
  projectId : any;
  currentbuildingId: any;
  cloneCostHead: any;
  clonedBuildingId : string;
  cloneBuildingForm: FormGroup;
  model: Building = new Building();
  clonedBuildingDetails: any;
  constructor(private listBuildingService: BuildingListService, private viewBuildingService: BuildingDetailsService, private _router: Router,
              private activatedRoute:ActivatedRoute, private messageService: MessageService,
              private createBuildingService: CreateBuildingService, private formBuilder: FormBuilder ) {

    this.cloneBuildingForm = this.formBuilder.group({
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
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      if(this.projectId) {
        this.getProjects();
      }
    });
  }
  onSubmit() {
    if(this.cloneBuildingForm.valid) {
      this.model = this.cloneBuildingForm.value;
      this.createBuildingService.addBuilding(this.model)
        .subscribe(
          building => this.addNewBuildingSuccess(building),
          error => this.addNewBuildingFailed(error));
    }
  }
  addNewBuildingSuccess(building : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
    this.messageService.message(message);
    this.clonedBuildingId = building.data._id;
  }

  addNewBuildingFailed(error : any) {
    console.log(error);
  }
  updateBuilding(cloneCostHead: any) {
    this.listBuildingService.updateBuildingByCostHead(cloneCostHead, this.clonedBuildingId).subscribe(
      project => this.updateBuildingSuccess(project),
      error => this.updateBuildingFail(error)
    );
  }
  updateBuildingSuccess(project: any) {
    this.getProjects();
  }
  updateBuildingFail(error: any) {
    console.log(error);
  }
  addNewBuilding() {
    this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
  }
  deletefun(buildingId : any) {
    this.currentbuildingId = buildingId;
    console.log('Building Id:'+buildingId);
  }
  deleteBuilding() {
    this.listBuildingService.deleteBuildingById(this.currentbuildingId).subscribe(
      project => this.onDeleteBuildingSuccess(project),
      error => this.onDeleteBuildingFail(error)
    );
  }

  getProjects() {
    this.listBuildingService.getProject(this.projectId).subscribe(
      projects => this.onGetProjectSuccess(projects),
      error => this.onGetProjectFail(error)
    );
  }

  onGetProjectSuccess(projects : any) {
    this.buildings = projects.data[0].building;
  }

  onGetProjectFail(error : any) {
    console.log(error);
  }

  onDeleteBuildingSuccess(result : any) {
    if (result !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DELETE_BUILDING;
      console.log(result);
      this.messageService.message(message);
      this.getProjects();
    }
  }

  onDeleteBuildingFail(error : any) {
    console.log(error);
  }

  getMessages() {
    return Messages;
  }

  getLabels() {
    return Label;
  }

  getButtons() {
    return Button;
  }

  getHeadings() {
    return Headings;
  }

  getBuildingDetails(buildingId : any) {
    console.log('building Id : '+buildingId);
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
    this._router.navigate([NavigationRoutes.APP_VIEW_BUILDING_DETAILS, buildingId]);
  }

  cloneThisBuilding(buildingId : any) {
    console.log('building Id : '+buildingId);
    this.viewBuildingService.getBuildingDetails(buildingId).subscribe(
      building => this.onGetBuildingDataSuccess(building),
      error => this.onGetBuildingDataFail(error)
    );
  }

  onGetBuildingDataSuccess(building : any) {
    let buildingDetails=building.data;
    this.clonedBuildingDetails = building.data.costHead;
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

  onGetBuildingDataFail(error : any) {
    console.log(error);
  }
}
