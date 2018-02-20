import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Messages, NavigationRoutes } from '../../../../../shared/constants';
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
  clonedBuildingId : string;
  cloneBuildingForm: FormGroup;
  model: Building = new Building();
  clonedBuildingDetails: any;
  constructor(private listBuildingService: BuildingListService, private viewBuildingService: BuildingDetailsService,
              private _router: Router, private activatedRoute:ActivatedRoute, private messageService: MessageService,
              private createBuildingService: CreateBuildingService, private formBuilder: FormBuilder ) {

    this.cloneBuildingForm = this.formBuilder.group({
      'name': ['', ValidationService.requiredBuildingName],
      'totalSlabArea':['', ValidationService.requiredSlabArea],
      'totalCarpetAreaOfUnit':['', ValidationService.requiredCarpetArea],
      'totalSaleableAreaOfUnit':['', ValidationService.requiredSalebleArea],
      'plinthArea':['', ValidationService.requiredPlinthArea],
      'totalNumOfFloors':['', ValidationService.requiredNumOfFloors],
      'numOfParkingFloors':['', ValidationService.requiredNumOfParkingFloors],
      'carpetAreaOfParking':['', ValidationService.requiredCarpetAreaOfParking],
      'numOfOneBHK': ['',  ValidationService.requiredOneBHK],
      'numOfTwoBHK':['', ValidationService.requiredTwoBHK],
      'numOfThreeBHK':['', ValidationService.requiredThreeBHK],
      'numOfFourBHK':['', ValidationService.requiredFourBHK],
      'numOfFiveBHK':['', ValidationService.requiredFiveBHK],
      'numOfLifts':['', ValidationService.requiredNumOfLifts],
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
      this.createBuildingService.addNewBuilding(this.model)
        .subscribe(
          building => this.onAddNewBuildingSuccess(building),
          error => this.onAdNewBuildingFailure(error));
    }
  }
  onAddNewBuildingSuccess(building : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
    this.messageService.message(message);
    this.clonedBuildingId = building.data._id;
  }

  onAdNewBuildingFailure(error : any) {
    console.log(error);
  }
  updateBuilding(cloneCostHead: any) {
    this.listBuildingService.updateBuildingByCostHead(cloneCostHead, this.clonedBuildingId).subscribe(
      project => this.onUpdateBuildingByCostHeadSuccess(project),
      error => this.onUpdateBuildingByCostHeadFailure(error)
    );
  }
  onUpdateBuildingByCostHeadSuccess(project: any) {
    this.getProjects();
  }
  onUpdateBuildingByCostHeadFailure(error: any) {
    console.log(error);
  }
  addNewBuilding() {
    this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
  }
  deletefun(buildingId : any) {
    this.currentbuildingId = buildingId;
  }
  deleteBuilding() {
    this.listBuildingService.deleteBuildingById(this.currentbuildingId).subscribe(
      project => this.onDeleteBuildingSuccess(project),
      error => this.onDeleteBuildingFailure(error)
    );
  }

  onDeleteBuildingSuccess(result : any) {
    if (result !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DELETE_BUILDING;
      this.messageService.message(message);
      this.getProjects();
    }
  }

  onDeleteBuildingFailure(error : any) {
    console.log(error);
  }

  getProjects() {
    this.listBuildingService.getProject(this.projectId).subscribe(
      projects => this.onGetProjectSuccess(projects),
      error => this.onGetProjectFailure(error)
    );
  }

  onGetProjectSuccess(projects : any) {
    this.buildings = projects.data[0].building;
  }

  onGetProjectFailure(error : any) {
    console.log(error);
  }

  getBuildingDetails(buildingId : any) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
    this._router.navigate([NavigationRoutes.APP_VIEW_BUILDING_DETAILS, buildingId]);
  }

  cloneThisBuilding(buildingId : any) {
    this.viewBuildingService.getBuildingDetails(buildingId).subscribe(
      building => this.onGetBuildingDetailsSuccess(building),
      error => this.onGetBuildingDetailsFailure(error)
    );
  }

  onGetBuildingDetailsSuccess(building : any) {
    let buildingDetails=building.data;
    this.clonedBuildingDetails = building.data.costHead;
    this.model.name = buildingDetails.name;
    this.model.totalSlabArea = buildingDetails.totalSlabArea;
    this.model.totalCarpetAreaOfUnit = buildingDetails.totalCarperAreaOfUnit;
    this.model.totalSaleableAreaOfUnit = buildingDetails.totalSaleableAreaOfUnit;
    this.model.plinthArea = buildingDetails.plinthArea;
    this.model.totalNumOfFloors = buildingDetails.totalNoOfFloors;
    this.model.numOfParkingFloors = buildingDetails.noOfParkingFloors;
    this.model.carpetAreaOfParking = buildingDetails.carpetAreaOfParking;
    this.model.numOfOneBHK = buildingDetails.noOfOneBHK;
    this.model.numOfTwoBHK = buildingDetails.noOfTwoBHK;
    this.model.numOfThreeBHK = buildingDetails.noOfThreeBHK;
    this.model.numOfFourBHK = buildingDetails.noOfFourBHK;
    this.model.numOfFiveBHK = buildingDetails.noOfFiveBHK;
    this.model.numOfLifts = buildingDetails.noOfLift;
  }

  onGetBuildingDetailsFailure(error : any) {
    console.log(error);
  }
}
