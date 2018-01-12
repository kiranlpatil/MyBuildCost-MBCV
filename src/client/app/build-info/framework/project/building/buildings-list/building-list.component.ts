import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../../../shared/constants';
import { BuildingListService } from './building-list.service';
import { BuildingDetailsService } from '../building-details/building-details.service';
import { Building } from '../../../model/building';
import { SessionStorage, SessionStorageService,MessageService } from '../../../../../shared/index';
import { Message } from '../../../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'bi-list-building',
  templateUrl: 'building-list.component.html'
})

export class BuildingListComponent implements OnInit {

  buildings : any;
  projectId : any;
  model: Building = new Building();
  constructor(private listBuildingService: BuildingListService, private viewBuildingService: BuildingDetailsService, private _router: Router,
              private activatedRoute:ActivatedRoute, private messageService: MessageService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      if(this.projectId) {
        this.getProjects();
      }
    });
  }
  addNewBuilding() {
    this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
  }

  deleteBuilding(buildingId : any) {
    this.listBuildingService.deleteBuildingById(buildingId).subscribe(
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

  onGetBuildingSuccess(building : any) {
    let buildingDetails=building.data[0];
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

  onGetBuildingFail(error : any) {
    console.log(error);
  }
}
