import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Messages, Headings } from '../../../../../shared/constants';
import { Building } from './../../../model/building';
import { MessageService } from '../../../../../shared/index';
import { Message } from '../../../../../shared/index';
import { BuildingService } from '../building.service';
import { SessionStorage, SessionStorageService } from '../../../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'bi-building-details',
  templateUrl: 'building-details.component.html'
})

export class BuildingDetailsComponent implements OnInit {

  buildingId : string;
  buildingModel: Building = new Building();
  public isShowErrorMessage: boolean = true;
  public errorMessage: boolean = false;

  constructor(private buildingService: BuildingService,
              private activatedRoute:ActivatedRoute, private messageService: MessageService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.buildingId = params['buildingId'];
      if(this.buildingId) {
        this.getBuilding();
      }
    });
  }

  getBuilding() {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.buildingService.getBuilding(projectId,this.buildingId).subscribe(
      building => this.onGetBuildingSuccess(building),
      error => this.onGetBuildingFailure(error)
    );
  }

  onGetBuildingSuccess(building : any) {
    this.buildingModel = building.data;
  }

  onGetBuildingFailure(error : any) {
    var message = new Message();

    if (error.err_code === 404 || error.err_code === 0) {
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.errorMessage = error.err_msg;
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    }
  }


  updateBuilding(buildingModel : Building) {
      let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
      this.buildingService.updateBuilding( projectId, buildingId, buildingModel)
        .subscribe(
          building => this.updateBuildingSuccess(building),
          error => this.updateBuildingFailure(error));
  }

  updateBuildingSuccess(result: any) {

    if (result !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_UPDATE_BUILDING_DETAILS;
      this.messageService.message(message);
    }
  }

  updateBuildingFailure(error: any) {

    var message = new Message();

    if (error.err_code === 404 || error.err_code === 0) {
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.errorMessage = error.err_msg;
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    }
  }

  getHeadings() {
    return Headings;
  }
}
