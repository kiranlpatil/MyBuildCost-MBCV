import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { NavigationRoutes, ProjectElements } from '../../../../shared/constants';
import { SessionStorage, SessionStorageService,  Message, Messages, MessageService } from '../../../../shared/index';
import { CostSummaryService } from './cost-summary.service';
import { Building } from '../../model/building';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../../../../shared/customvalidations/validation.service';
import { BuildingService } from '../building/building.service';
import { CostHead } from '../../model/costhead';
import { EstimateReport } from '../../model/estimate-report';
import { BuildingReport } from '../../model/building-report';

@Component({
  moduleId: module.id,
  selector: 'bi-cost-summary-report',
  templateUrl: 'cost-summary.component.html',
  styleUrls: ['cost-summary.component.css'],
})

export class CostSummaryComponent implements OnInit {

  projectBuildings: Array <BuildingReport>;
  projectId: string;
  buildingId: string;
  cloneBuildingId: string;
  costHeadId: number;

  grandTotalofBudgetedCost: number;
  grandTotalofTotalRate: number;
  grandTotalofArea: number;
  grandTotalofEstimatedCost : number;
  grandTotalofEstimatedRate : number;

  buildingName : string;
  buildingsDetails: Building;
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
    { 'costInId': 'Rs/Sqft'},
    { 'costInId': 'Rs/Sqmt'}
  ];

  public costPer: any[] = [
    { 'costPerId': 'SlabArea'},
    { 'costPerId': 'SalebleArea'},
    { 'costPerId': 'CarpetArea'},
  ];

  defaultCostIn:string='Rs/Sqft';
  defaultCostPer:string='SlabArea';
  deleteConfirmationCostHead = ProjectElements.COST_HEAD;
  deleteConfirmationBuilding = ProjectElements.BUILDING;

  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute,
              private formBuilder: FormBuilder, private _router : Router, private messageService : MessageService,
              private buildingService: BuildingService ) {

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
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      if(this.projectId) {
        this.onChangeCostingByUnit(this.defaultCostIn);
      }
    });
  }


  setBuildingId(buildingId: string, i:number) {
    this.compareIndex = i;
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
  }

  getInActiveCostHeads(buildingId: string) {
    this.buildingId=buildingId;
    this.costSummaryService.getInActiveCostHeads(this.projectId,this.buildingId).subscribe(
      inActiveCostHeads => this.onGetInActiveCostHeadsSuccess(inActiveCostHeads),
      error => this.onGetInActiveCostHeadsFailure(error)
    );
  }


  onGetInActiveCostHeadsSuccess(inActiveCostHeads : any) {
      this.inActiveCostHeadArray=inActiveCostHeads.data;
      this.showCostHeadList=true;
  }

  onGetInActiveCostHeadsFailure(error : any) {
    console.log(error);
  }

  getAmount(buildingName:string, buildingId : string, estimatedItem :any) {
    this.estimatedItem = estimatedItem;
    this.costHeadId = estimatedItem.rateAnalysisId;
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
    this.buildingId =  SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);

    this._router.navigate([NavigationRoutes.APP_PROJECT, this.projectId, NavigationRoutes.APP_BUILDING, buildingName,
    NavigationRoutes.APP_COST_SUMMARY, NavigationRoutes.APP_COST_HEAD, estimatedItem.name, this.costHeadId]);
  }

  getCommonAmenities() {
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this._router.navigate([NavigationRoutes.APP_PROJECT,this.projectId,NavigationRoutes.APP_COMMON_AMENITIES]);
  }

  getBuildingDetails() {
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    this.buildingService.getBuilding(this.projectId,buildingId).subscribe(
      buildingDetails => this.onGetBuildingDetailsSuccess(buildingDetails),
      error => this.onGetBuildingDetailsFailure(error)
    );
  }

  onGetBuildingDetailsSuccess(buildingDetails : any) {
    this.buildingsDetails = buildingDetails.data;
  }

  onGetBuildingDetailsFailure(error : any) {
    console.log(error);
  }

  onChangeCostingByUnit(costInId:any) {
    if(costInId) {
      this.defaultCostIn=costInId;
    }
    this.costSummaryService.getCostSummaryReport(this.projectId,this.defaultCostIn,this.defaultCostPer).subscribe(
      projectCostIn => this.onGetCostSummaryReportSuccess(projectCostIn),
      error => this.onGetCostSummaryReportFailure(error)
    );
  }

  onGetCostSummaryReportSuccess(projects : any) {
    this.projectBuildings = projects.data;
    this.calculateGrandTotal();
  }

  onGetCostSummaryReportFailure(error : any) {
    console.log('onGetCostInFail()'+error);
  }

  onChangeCostingByArea(costPerId:any) {
    this.defaultCostPer=costPerId;
    this.costSummaryService.getCostSummaryReport(this.projectId,this.defaultCostIn,this.defaultCostPer).subscribe(
      projectCostPer => this.onGetCostSummaryReportSuccess(projectCostPer),
      error => this.onGetCostSummaryReportFailure(error)
    );
  }

  setIdsForInActiveCostHead(buildingId: string, costHeadId: number) {
    this.buildingId = buildingId;
    this.costHeadId = costHeadId;
  }

  inActiveCostHead() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.costSummaryService.inActiveCostHead(projectId,this.buildingId, this.costHeadId).subscribe(
        costHeadDetail => this.onInActiveCostHeadSuccess(costHeadDetail),
        error => this.onInActiveCostHeadFailure(error)
      );
    }

  onInActiveCostHeadSuccess(costHeadDetail: any) {
    this.onChangeCostingByUnit(this.defaultCostIn);
     if ( costHeadDetail!== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DELETE_COSTHEAD;
      this.messageService.message(message);
    }
  }

  onInActiveCostHeadFailure(error: any) {
    console.log(error);
  }

  onChangeActiveSelectedCostHead(selectedInactiveCostHeadId:number) {
    this.showCostHeadList=false;
    this.costSummaryService.activeCostHead(selectedInactiveCostHeadId,this.projectId,this.buildingId).subscribe(
      inActiveCostHeads => this.onActiveCostHeadSuccess(inActiveCostHeads),
      error => this.onActiveCostHeadFailure(error)
    );
  }

  onActiveCostHeadSuccess(inActiveCostHeads : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_COSTHEAD;
    this.messageService.message(message);
    this.onChangeCostingByUnit(this.defaultCostIn);
  }

  onActiveCostHeadFailure(error : any) {
    console.log('onAddInactiveCostHeadFailure()'+error);
  }

  changeBudgetedCost(buildingId: string, costHead: string, amount: number, buildingArea : number) {
    if (amount !== null) {
      let costIn : string;
      let costPer : string;
      (this.defaultCostIn==='Rs/Sqft') ? costIn = 'sqft' : costIn = 'sqmt';
      (this.defaultCostPer==='SlabArea') ? costPer = 'slabArea' : costPer = 'saleableArea';
      let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      this.costSummaryService.updateBudgetedCost(projectId, buildingId, costHead, costIn, costPer, buildingArea, amount).subscribe(
        buildingDetails => this.onUpdateBudgetedCostSuccess(buildingDetails),
        error => this.onUpdateBudgetedCostFailure(error)
      );
    }
  }

  onUpdateBudgetedCostSuccess(buildingDetails : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_BUDGETED_COST_COSTHEAD;
    this.messageService.message(message);
    this.onChangeCostingByUnit(this.defaultCostIn);
  }

  onUpdateBudgetedCostFailure(error : any) {
    console.log('onAddCostheadSuccess : '+error);
  }

  setIdForDeleteBuilding(buildingId : string) {
    this.buildingId = buildingId;
  }

  deleteBuilding() {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.buildingService.deleteBuildingById( projectId,this.buildingId).subscribe(
      project => this.onDeleteBuildingByIdSuccess(project),
      error => this.onDeleteBuildingByIdFailure(error)
    );
  }

  onDeleteBuildingByIdSuccess(result : any) {
    if (result !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DELETE_BUILDING;
      this.messageService.message(message);
      this.onChangeCostingByUnit(this.defaultCostIn);
      }
  }

  onDeleteBuildingByIdFailure(error : any) {
    console.log(error);
  }

  createBuilding() {
    this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
  }

  editBuildingDetails(buildingId: string) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
    this._router.navigate([NavigationRoutes.APP_VIEW_BUILDING_DETAILS, buildingId]);
  }

  cloneBuilding(buildingId: string) {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.buildingService.getBuildingDetailsForClone(projectId,buildingId).subscribe(
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
      this.cloneBuildingModel = this.cloneBuildingForm.value;
      let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      this.buildingService.createBuilding(projectId, this.cloneBuildingModel)
        .subscribe(
          building => this.onCreateBuildingSuccess(building),
          error => this.onCreateBuildingFailure(error));
    }
  }

  onCreateBuildingSuccess(building: any) {
    this.cloneBuildingId = building.data._id;
  }

  onCreateBuildingFailure(error: any) {
    console.log(error);
  }

  cloneBuildingCostHeads(cloneCostHead: CostHead) {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.buildingService.cloneBuildingCostHeads(projectId,cloneCostHead, this.cloneBuildingId).subscribe(
      project => this.onCloneBuildingCostHeadsSuccess(project),
      error => this.onCloneBuildingCostHeadsFailure(error)
    );
  }

  onCloneBuildingCostHeadsSuccess(project: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
    this.messageService.message(message);
    this.onChangeCostingByUnit(this.defaultCostIn);
  }

  onCloneBuildingCostHeadsFailure(error: any) {
    console.log(error);
  }

  calculateGrandTotal() {
    //ToDo we have to remove this code after
    this.grandTotalofBudgetedCost = 0;
    this.grandTotalofTotalRate = 0;
    this.grandTotalofArea = 0;

    this.grandTotalofEstimatedCost = 0;
    this.grandTotalofEstimatedRate = 0;

    for (let buildindIndex = 0; buildindIndex < this.projectBuildings.length; buildindIndex++) {

      this.grandTotalofBudgetedCost = this.grandTotalofBudgetedCost +
        parseFloat((this.projectBuildings[buildindIndex].thumbRule.totalBudgetedCost).toFixed(2));

      this.grandTotalofTotalRate = this.grandTotalofTotalRate +
        parseFloat((this.projectBuildings[buildindIndex].thumbRule.totalRate).toFixed(2));

      this.grandTotalofArea =( this.grandTotalofArea + parseFloat((this.projectBuildings[buildindIndex].area).toFixed(2)));

      this.grandTotalofEstimatedCost = this.grandTotalofEstimatedCost +
        parseFloat((this.projectBuildings[buildindIndex].estimate.totalEstimatedCost).toFixed(2));

      this.grandTotalofEstimatedRate = this.grandTotalofEstimatedRate +
        parseFloat((this.projectBuildings[buildindIndex].estimate.totalRate).toFixed(2));
    }
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
}
