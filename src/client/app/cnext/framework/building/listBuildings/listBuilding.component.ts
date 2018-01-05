import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../../shared/constants';
import { ListBuildingService } from './listBuilding.service';
import { ViewBuildingService } from './../viewBuilding/viewBuilding.service';
import { Building } from './../../model/building';
import {SessionStorage, SessionStorageService} from "../../../../shared/index";

@Component({
  moduleId: module.id,
  selector: 'bi-list-building',
  templateUrl: 'listBuilding.component.html'
})

export class ListBuildingComponent implements OnInit {

  buildings : any;
  model: Building = new Building();

  constructor(private listBuildingService: ListBuildingService,private viewBuildingService: ViewBuildingService, private _router: Router) {

  }

  ngOnInit() {
    this.getProjects();
  }
  addNewBuilding() {
    this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
  }

  deleteBuilding(buildingId : any) {
    this.listBuildingService.deleteBuildingById(buildingId).subscribe(
      projects => this.onDeleteBuildingSuccess(projects),
      error => this.onDeleteBuildingFail(error)
    );
  }

  getProjects() {
    this.listBuildingService.getProject().subscribe(
      projects => this.onGetProjectSuccess(projects),
      error => this.onGetProjectFail(error)
    );
  }

  onGetProjectSuccess(projects : any) {
    console.log(projects);
    this.buildings = projects.data[0].building;
  }

  onGetProjectFail(error : any) {
    console.log(error);
  }

  onDeleteBuildingSuccess(projects : any) {
    console.log(projects);
    this.getProjects();
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
    //this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
    this._router.navigate([NavigationRoutes.APP_VIEW_BUILDING_DETAILS]);
    /*this.viewBuildingService.getBuildingDetails(buildingId).subscribe(
      building => this.onGetBuildingSuccess(building),
      error => this.onGetBuildingFail(error)
    );*/
  }

  onGetBuildingSuccess(building : any) {
    console.log('Building Data: '+JSON.stringify(building.data[0]));
    let buildingDetails=building.data[0];
    this.model.name=buildingDetails.name;
    console.log('Project name: '+buildingDetails.name);
    this.model.totalSlabArea=buildingDetails.totalSlabArea;
    console.log('totalSlabArea: '+buildingDetails.totalSlabArea);
    this.model.totalCarperAreaOfUnit=buildingDetails.totalCarperAreaOfUnit;
    console.log('totalCarperAreaOfUnit: '+buildingDetails.totalCarperAreaOfUnit);
    this.model.totalParkingAreaOfUnit=buildingDetails.totalParkingAreaOfUnit;
    console.log('totalParkingAreaOfUnit: '+buildingDetails.totalParkingAreaOfUnit);
    this.model.noOfOneBHK=buildingDetails.noOfOneBHK;
    console.log('noOfOneBHK: '+buildingDetails.noOfOneBHK);
    this.model.noOfTwoBHK=buildingDetails.noOfTwoBHK;
    console.log('noOfTwoBHK: '+buildingDetails.noOfTwoBHK);
    this.model.noOfThreeBHK=buildingDetails.noOfThreeBHK;
    console.log('noOfThreeBHK: '+buildingDetails.noOfThreeBHK);
    this.model.noOfSlab=buildingDetails.noOfSlab;
    console.log('noOfSlab: '+buildingDetails.noOfSlab);
    this.model.noOfLift=buildingDetails.noOfLift;
    console.log('noOfLift: '+buildingDetails.noOfLift);
  }

  onGetBuildingFail(error : any) {
    console.log(error);
  }
}
