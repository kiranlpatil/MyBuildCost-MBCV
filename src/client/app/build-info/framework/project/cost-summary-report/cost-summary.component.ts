import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import {
  NavigationRoutes, ProjectElements, Button, Menus, Headings, Label,
  ValueConstant
} from '../../../../shared/constants';
import { SessionStorage, SessionStorageService,  Message, Messages, MessageService } from '../../../../shared/index';
import { CostSummaryService } from './cost-summary.service';
import { Building } from '../../model/building';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../../../../shared/customvalidations/validation.service';
import { BuildingService } from '../building/building.service';
import { CostHead } from '../../model/costhead';
import { EstimateReport } from '../../model/estimate-report';
import { BuildingReport } from '../../model/building-report';
import ProjectReport = require('../../model/project-report');
import { LoaderService } from '../../../../shared/loader/loaders.service';
import * as jsPDF from 'jspdf';
/*/// <reference path='../../../../../../../tools/manual_typings/project/jspdf.d.ts'/>*/
@Component({
  moduleId: module.id,
  selector: 'bi-cost-summary-report',
  templateUrl: 'cost-summary.component.html',
  styleUrls: ['cost-summary.component.css'],
})

export class CostSummaryComponent implements OnInit {

  @ViewChild('content') content: ElementRef;
  buildingsReport: Array <BuildingReport>;
  amenitiesReport: BuildingReport;
  projectReport: ProjectReport;
  projectId: string;
  buildingId: string;
  cloneBuildingId: string;
  costHeadId: number;

  grandTotalOfBudgetedCost: number;
  grandTotalOfTotalRate: number;
  grandTotalOfArea: number;
  grandTotalOfEstimatedCost : number;
  grandTotalOfEstimatedRate : number;

  buildingName : string;
  costHead: string;

  estimatedItem: EstimateReport;
  showCostHeadList:boolean=false;
  showGrandTotalPanelBody:boolean=true;
  compareIndex:number=0;

 public inActiveCostHeadArray: Array<CostHead>;
  cloneBuildingForm: FormGroup;
  cloneBuildingModel: Building = new Building();
  clonedBuildingDetails: Array<CostHead>;

  public costIn: any[] = [
    { 'costInId': ProjectElements.RS_PER_SQFT},
    { 'costInId': ProjectElements.RS_PER_SQMT}
  ];

  public costPer: any[] = [
    { 'costPerId': ProjectElements.SLAB_AREA},
    { 'costPerId': ProjectElements.SALEABLE_AREA},
    { 'costPerId': ProjectElements.CARPET_AREA},
  ];

  defaultCostingByUnit:string = ProjectElements.RS_PER_SQFT;
  defaultCostingByArea:string = ProjectElements.SLAB_AREA;
  deleteConfirmationCostHead = ProjectElements.COST_HEAD;
  deleteConfirmationBuilding = ProjectElements.BUILDING;

  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute,
              private formBuilder: FormBuilder, private _router : Router, private messageService : MessageService,
              private buildingService: BuildingService, private loaderService : LoaderService) {

    this.cloneBuildingForm = this.formBuilder.group({
      name : ['', ValidationService.requiredBuildingName],
      totalSlabArea :['', ValidationService.requiredSlabArea],
      totalCarpetAreaOfUnit :['', ValidationService.requiredCarpetArea],
      totalSaleableAreaOfUnit :['', ValidationService.requiredSalebleArea],
      plinthArea :['', ValidationService.requiredPlinthArea],
      totalNumOfFloors :['', ValidationService.requiredTotalNumOfFloors],
      numOfParkingFloors :['', ValidationService.requiredNumOfParkingFloors],
      carpetAreaOfParking :['', ValidationService.requiredCarpetAreaOfParking],
      numOfOneBHK : [''],
      numOfTwoBHK :[''],
      numOfThreeBHK :[''],
      numOfFourBHK :[''],
      numOfFiveBHK :[''],
      numOfLifts :['']
    });
  }

  ngOnInit() {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_VIEW,'costSummary');
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      if(this.projectId) {
        this.onChangeCostingByUnit(this.defaultCostingByUnit);
      }
    });
  }

  setBuildingId( i:number, buildingId: string) {
    this.compareIndex = i;
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
  }

  getAllInActiveCostHeads(buildingId: string) {
    this.buildingId=buildingId;
    this.costSummaryService.getAllInActiveCostHeads( this.projectId, this.buildingId).subscribe(
      inActiveCostHeads => this.onGetAllInActiveCostHeadsSuccess(inActiveCostHeads),
      error => this.onGetAllInActiveCostHeadsFailure(error)
    );
  }

  onGetAllInActiveCostHeadsSuccess(inActiveCostHeads : any) {
      this.inActiveCostHeadArray=inActiveCostHeads.data;
      this.showCostHeadList=true;
  }

  onGetAllInActiveCostHeadsFailure(error : any) {
    console.log(error);
  }

  goToCostHeadView( buildingId : string, buildingName:string, estimatedItem :any) {

    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
    this.buildingId =  SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);

    this._router.navigate([NavigationRoutes.APP_PROJECT, this.projectId, NavigationRoutes.APP_BUILDING,
      buildingName, NavigationRoutes.APP_COST_HEAD, estimatedItem.name,  estimatedItem.rateAnalysisId, NavigationRoutes.APP_CATEGORY]);
  }

  goToCommonAmenities() {
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this._router.navigate([NavigationRoutes.APP_PROJECT,this.projectId,NavigationRoutes.APP_COMMON_AMENITIES]);
  }

  onChangeCostingByUnit(costingByUnit:any) {
    this.defaultCostingByUnit=costingByUnit;
    this.costSummaryService.getCostSummaryReport( this.projectId, this.defaultCostingByUnit, this.defaultCostingByArea).subscribe(
      projectCostIn => this.onGetCostSummaryReportSuccess(projectCostIn),
      error => this.onGetCostSummaryReportFailure(error)
    );
  }

  onGetCostSummaryReportSuccess(projects : any) {
    this.projectReport = new ProjectReport( projects.data.buildings, projects.data.commonAmenities[0]) ;
    this.buildingsReport = this.projectReport.buildings;
    this.amenitiesReport = this.projectReport.commonAmenities;
    this.calculateGrandTotal();
  }

  onGetCostSummaryReportFailure(error : any) {
    console.log('onGetCostInFail()'+error);
  }

  //TODO : Check if can merge
  onChangeCostingByArea(costingByArea:any) {
    this.defaultCostingByArea=costingByArea;
    this.costSummaryService.getCostSummaryReport( this.projectId, this.defaultCostingByUnit, this.defaultCostingByArea).subscribe(
      projectCostPer => this.onGetCostSummaryReportSuccess(projectCostPer),
      error => this.onGetCostSummaryReportFailure(error)
    );
  }

  setIdsToInActiveCostHead(buildingId: string, costHeadId: number) {
    this.buildingId = buildingId;
    this.costHeadId = costHeadId;
  }

  inActiveCostHead() {
    this.loaderService.start();
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.costSummaryService.inActiveCostHead( projectId, this.buildingId, this.costHeadId).subscribe(
        costHeadDetail => this.onInActiveCostHeadSuccess(costHeadDetail),
        error => this.onInActiveCostHeadFailure(error)
      );
    }

  onInActiveCostHeadSuccess(costHeadDetails: any) {
    this.loaderService.stop();
     if ( costHeadDetails !== null) {
      this.showCostHeadList = false;
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DELETE_COSTHEAD;
      this.messageService.message(message);
    }
    this.onChangeCostingByUnit(this.defaultCostingByUnit);
  }

  onInActiveCostHeadFailure(error: any) {
    console.log(error);
    this.loaderService.stop();
  }

  onChangeActiveSelectedCostHead(selectedInActiveCostHeadId:number) {
    this.showCostHeadList=false;
    this.loaderService.start();
    this.costSummaryService.activeCostHead( this.projectId, this.buildingId, selectedInActiveCostHeadId).subscribe(
      inActiveCostHeads => this.onActiveCostHeadSuccess(inActiveCostHeads),
      error => this.onActiveCostHeadFailure(error)
    );
  }

  onActiveCostHeadSuccess(inActiveCostHeads : any) {
    this.loaderService.stop();
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_COSTHEAD;
    this.messageService.message(message);
    this.onChangeCostingByUnit(this.defaultCostingByUnit);
  }

  onActiveCostHeadFailure(error : any) {
    console.log('onActiveCostHeadFailure()'+error);
    this.loaderService.stop();
  }

  changeBudgetedCostAmountOfBuildingCostHead(buildingId: string, costHead: string, amount: number) {
    if (amount !== null) {
      let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      this.costSummaryService.changeBudgetedCostAmountOfBuildingCostHead( projectId, buildingId, costHead, amount).subscribe(
        buildingDetails => this.onUpdateRateOfThumbRuleSuccess(buildingDetails),
        error => this.onUpdateRateOfThumbRuleFailure(error)
      );
    }
  }

  onUpdateRateOfThumbRuleSuccess(buildingDetails : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_THUMBRULE_RATE_COSTHEAD;
    this.messageService.message(message);
    this.onChangeCostingByUnit(this.defaultCostingByUnit);
  }

  onUpdateRateOfThumbRuleFailure(error : any) {
    console.log('onAddCostheadSuccess : '+error);
  }

  setIdForDeleteBuilding(buildingId : string) {
    this.buildingId = buildingId;
  }

  deleteBuilding() {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.buildingService.deleteBuilding( projectId, this.buildingId).subscribe(
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
      this.onChangeCostingByUnit(this.defaultCostingByUnit);
      }
  }

  onDeleteBuildingFailure(error : any) {
    console.log(error);
  }

  goToEditBuilding(buildingId: string) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
    this._router.navigate([NavigationRoutes.APP_VIEW_BUILDING_DETAILS, buildingId]);
  }

  cloneBuilding(buildingId: string) {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.buildingService.getBuildingDetailsForClone( projectId, buildingId).subscribe(
      building => this.onGetBuildingDetailsForCloneSuccess(building),
      error => this.onGetBuildingDetailsForCloneFailure(error)
    );
  }

  onGetBuildingDetailsForCloneSuccess(building: any) {
    this.cloneBuildingModel = building.data;
    this.clonedBuildingDetails = building.data.costHeads;
  }

  onGetBuildingDetailsForCloneFailure(error: any) {
    console.log(error);
  }

  cloneBuildingBasicDetails() {
    if (this.cloneBuildingForm.valid) {
     // this.cloneBuildingModel = this.cloneBuildingForm.value;
      let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      this.buildingService.createBuilding( projectId, this.cloneBuildingModel)
        .subscribe(
          building => this.onCreateBuildingSuccess(building),
          error => this.onCreateBuildingFailure(error));
    }
  }

  onCreateBuildingSuccess(building: any) {
    //this.cloneBuildingId = building.data._id;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_CLONED_BUILDING_DETAILS;
    this.messageService.message(message);
    this.onChangeCostingByUnit(this.defaultCostingByUnit);
  }

  onCreateBuildingFailure(error: any) {
    console.log(error);
  }

  cloneBuildingCostHeads(cloneCostHead: CostHead) {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.buildingService.cloneBuildingCostHeads( projectId, this.cloneBuildingId, cloneCostHead).subscribe(
      project => this.onCloneBuildingCostHeadsSuccess(project),
      error => this.onCloneBuildingCostHeadsFailure(error)
    );
  }

  onCloneBuildingCostHeadsSuccess(project: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
    this.messageService.message(message);
    this.onChangeCostingByUnit(this.defaultCostingByUnit);
  }

  onCloneBuildingCostHeadsFailure(error: any) {
    console.log(error);
  }

  calculateGrandTotal() {
    //ToDo we have to remove this code after
    this.grandTotalOfBudgetedCost = 0;
    this.grandTotalOfTotalRate = 0;
    this.grandTotalOfArea = 0;

    this.grandTotalOfEstimatedCost = 0;
    this.grandTotalOfEstimatedRate = 0;

    //Calculate total of all building
    for (let buildindIndex = 0; buildindIndex < this.buildingsReport.length; buildindIndex++) {

      this.grandTotalOfBudgetedCost = this.grandTotalOfBudgetedCost +
        parseFloat((this.buildingsReport[buildindIndex].thumbRule.totalBudgetedCost).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

      this.grandTotalOfTotalRate = this.grandTotalOfTotalRate +
        parseFloat((this.buildingsReport[buildindIndex].thumbRule.totalRate).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

      this.grandTotalOfArea =( this.grandTotalOfArea + parseFloat((
        this.buildingsReport[buildindIndex].area).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT)));

      this.grandTotalOfEstimatedCost = this.grandTotalOfEstimatedCost +
        parseFloat((this.buildingsReport[buildindIndex].estimate.totalEstimatedCost).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

      this.grandTotalOfEstimatedRate = this.grandTotalOfEstimatedRate +
        parseFloat((this.buildingsReport[buildindIndex].estimate.totalRate).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
    }

    //Calculate total with amenities data
    this.grandTotalOfBudgetedCost = this.grandTotalOfBudgetedCost +
      parseFloat((this.amenitiesReport.thumbRule.totalBudgetedCost).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

    this.grandTotalOfTotalRate = this.grandTotalOfTotalRate +
      parseFloat((this.amenitiesReport.thumbRule.totalRate).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

    this.grandTotalOfEstimatedCost = this.grandTotalOfEstimatedCost +
      parseFloat((this.amenitiesReport.estimate.totalEstimatedCost).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

    this.grandTotalOfEstimatedRate = this.grandTotalOfEstimatedRate +
      parseFloat((this.amenitiesReport.estimate.totalRate).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
  }

  toggleShowGrandTotalPanelBody() {
    this.showGrandTotalPanelBody=!this.showGrandTotalPanelBody;
  }

  deleteElement(elementType : string) {
    if(elementType === ProjectElements.COST_HEAD) {
      this.inActiveCostHead();
    }
    if(elementType === ProjectElements.BUILDING) {
      this.deleteBuilding();
    }
  }

  getCostSummaryReport() {
    this.onChangeCostingByUnit(this.defaultCostingByUnit);
  }

  getMenus() {
    return Menus;
  }

  getLabel() {
    return Label;
  }

  getButton() {
    return Button;
  }

  getHeadings() {
    return Headings;
  }

  getProjectElements() {
    return ProjectElements;
  }

  downloadToPdf() {
    let doc = new jsPDF();
    let specialElementHandlers = {
      '#editor': function (element : any, renderer : any) {
        return true;
      }
    };

    let content = this.content.nativeElement;
    doc.fromHTML(content.innerHTML, 5, 5, {
      'width': 1900,
      'elementHandlers': specialElementHandlers
    });

    doc.save('test.pdf');
  }

}
