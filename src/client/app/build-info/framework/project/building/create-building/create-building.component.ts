import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Messages, NavigationRoutes, ImagePath, Headings, Button } from '../../../../../shared/constants';
import { SessionStorage, SessionStorageService,  Message,
  MessageService } from '../../../../../shared/index';
import { Building } from '../../../model/building';
import { BuildingService } from './../building.service';
import { LoaderService } from '../../../../../shared/loader/loaders.service';

@Component({
  moduleId: module.id,
  selector: 'bi-create-building',
  templateUrl: 'create-building.component.html',
  styleUrls: ['create-building.component.css'],
})

export class CreateBuildingComponent {

  BODY_BACKGROUND_TRANSPARENT: string;

  constructor(private buildingService: BuildingService, private loaderService: LoaderService,
              private _router: Router, private messageService: MessageService) {
    this.BODY_BACKGROUND_TRANSPARENT = ImagePath.BODY_BACKGROUND_TRANSPARENT;
  }

  goBack() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this._router.navigate([NavigationRoutes.APP_PROJECT,projectId,NavigationRoutes.APP_COST_SUMMARY]);
  }

  onSubmit(buildingModel : Building) {

      if((buildingModel.numOfOneBHK !== 0) || (buildingModel.numOfTwoBHK  !== 0 ) ||
        (buildingModel.numOfThreeBHK !== 0) || (buildingModel.numOfFourBHK !== 0) || (buildingModel.numOfFiveBHK !== 0)) {
      this.loaderService.start();
      let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      this.buildingService.createBuilding(projectId, buildingModel)
        .subscribe(
          building => this.onCreateBuildingSuccess(building),
          error => this.onCreateBuildingFailure(error));
      } else {
        var message = new Message();
        message.isError = false;
        message.custom_message = 'Add at least one Apartment Configuration';
        this.messageService.message(message);
      }
  }

  onCreateBuildingSuccess(building : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
    this.messageService.message(message);
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);

    this.buildingService.syncBuildingWithRateAnalysis(projectId, building.data._id).subscribe(
      building => this.onSyncBuildingWithRateAnalysisSuccess(building),
      error => this.onSyncBuildingWithRateAnalysisFailure(error));
  }

  onSyncBuildingWithRateAnalysisSuccess(building : Building) {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.loaderService.stop();
    this._router.navigate([NavigationRoutes.APP_PROJECT, projectId, NavigationRoutes.APP_COST_SUMMARY]);
  }

  onSyncBuildingWithRateAnalysisFailure(error:any) {
  console.log(error);
  }

  onCreateBuildingFailure(error : any) {
    console.log(error);
  }

  getHeadings() {
    return Headings;
  }

  getButton() {
    return Button;
  }
}
