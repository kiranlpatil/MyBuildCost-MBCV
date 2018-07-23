import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Messages, NavigationRoutes } from '../../../../../shared/constants';
import { LoaderService } from '../../../../../shared/loader/loaders.service';
import { Building } from '../../../model/building';
import { SessionStorage, SessionStorageService,MessageService } from '../../../../../shared/index';
import { Message } from '../../../../../shared/index';
import { BuildingService } from '../building.service';
import { ValidationService } from '../../../../../shared/customvalidations/validation.service';
import { ProjectService } from '../../project.service';

@Component({
  moduleId: module.id,
  selector: 'bi-building-list',
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

  constructor(private buildingService: BuildingService, private projectService : ProjectService, private _router: Router,
              private activatedRoute:ActivatedRoute,private messageService: MessageService, private formBuilder: FormBuilder,
              private loaderService: LoaderService) {

    this.cloneBuildingForm = this.formBuilder.group({
      name : ['', ValidationService.requiredBuildingName],
      totalSlabArea :['', ValidationService.requiredSlabArea],
      totalCarpetAreaOfUnit :['', ValidationService.requiredCarpetArea],
      totalSaleableAreaOfUnit :['', ValidationService.requiredSalebleArea],
      plinthArea :['', ValidationService.requiredPlinthArea],
      totalNumOfFloors :['', ValidationService.requiredTotalNumOfFloors],
      numOfParkingFloors :['', ValidationService.requiredNumOfParkingFloors],
      carpetAreaOfParking :['', ValidationService.requiredCarpetAreaOfParking],
      numOfOneBHK : ['',  ValidationService.requiredOneBHK],
      numOfTwoBHK :['', ValidationService.requiredTwoBHK],
      numOfThreeBHK :['', ValidationService.requiredThreeBHK],
      numOfFourBHK :['', ValidationService.requiredFourBHK],
      numOfFiveBHK :['', ValidationService.requiredFiveBHK],
      numOfLifts :['', ValidationService.requiredNumOfLifts],
    });

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      if(this.projectId) {
        this.getProject();
      }
    });
  }

  onSubmit() {
    if(this.cloneBuildingForm.valid) {
      this.model = this.cloneBuildingForm.value;
      let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      this.buildingService.createBuilding( projectId, this.model)
        .subscribe(
          building => this.onCreateBuildingSuccess(building),
          error => this.onCreateBuildingFailure(error));
    }
  }

  onCreateBuildingSuccess(building : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
    this.messageService.message(message);
    this.clonedBuildingId = building.data._id;
  }

  onCreateBuildingFailure(error : any) {
    console.log(error);
  }

  updateBuildingByCostHead(cloneCostHead: any) {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.loaderService.start();
    this.buildingService.cloneBuilding(projectId, this.clonedBuildingId, cloneCostHead).subscribe(
      project => this.onCloneBuildingCostHeadsSuccess(project),
      error => this.onCloneBuildingCostHeadsFailure(error)
    );
  }

  onCloneBuildingCostHeadsSuccess(project: any) {
    this.getProject();
    this.loaderService.stop();
  }

  onCloneBuildingCostHeadsFailure(error: any) {
    console.log(error);
    this.loaderService.stop();
  }

  createBuilding() {
    this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
  }

  setBuildingId(buildingId : any) {
    this.currentbuildingId = buildingId;
  }

  deleteBuilding() {
    this.loaderService.start();
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.buildingService.deleteBuilding( projectId, this.currentbuildingId).subscribe(
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
      this.loaderService.stop();
      this.getProject();
    }
  }

  onDeleteBuildingFailure(error : any) {
    console.log(error);
    this.loaderService.stop();
  }

  getProject() {
    //change  in projectService
    this.projectService.getProject(this.projectId).subscribe(
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

  navigateToEditBuildingDetails(buildingId : any) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
    this._router.navigate([NavigationRoutes.APP_VIEW_BUILDING_DETAILS, buildingId]);
  }

  cloneBuilding(buildingId : any) {
    this.loaderService.start();
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.buildingService.getBuilding( projectId, buildingId).subscribe(
      building => this.onGetBuildingSuccess(building),
      error => this.onGetBuildingFailure(error)
    );
  }

  onGetBuildingSuccess(building : any) {
    let buildingDetails=building.data;
    this.clonedBuildingDetails = building.data.costHead;
    this.model.name = buildingDetails.name;
    this.model.totalSlabArea = buildingDetails.totalSlabArea;
    this.model.totalCarpetAreaOfUnit = buildingDetails.totalCarpetAreaOfUnit;
    this.model.totalSaleableAreaOfUnit = buildingDetails.totalSaleableAreaOfUnit;
    this.model.plinthArea = buildingDetails.plinthArea;
    this.model.totalNumOfFloors = buildingDetails.totalNumOfFloors;
    this.model.numOfParkingFloors = buildingDetails.numOfParkingFloors;
    this.model.carpetAreaOfParking = buildingDetails.carpetAreaOfParking;
    this.model.numOfOneBHK = buildingDetails.numOfOneBHK;
    this.model.numOfTwoBHK = buildingDetails.numOfTwoBHK;
    this.model.numOfThreeBHK = buildingDetails.numOfThreeBHK;
    this.model.numOfFourBHK = buildingDetails.numOfFourBHK;
    this.model.numOfFiveBHK = buildingDetails.numOfFiveBHK;
    this.model.numOfLifts = buildingDetails.numOfLifts;
    this.loaderService.stop();
  }

  onGetBuildingFailure(error : any) {
    console.log(error);
    this.loaderService.stop();
  }
}
