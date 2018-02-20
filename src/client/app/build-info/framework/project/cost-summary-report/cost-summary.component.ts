import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { NavigationRoutes } from '../../../../shared/constants';
import { SessionStorage, SessionStorageService,  Message, Messages, MessageService } from '../../../../shared/index';
import { CostSummaryService } from './cost-summary.service';
import { BuildingListService } from '../building/buildings-list/building-list.service';
import { BuildingDetailsService } from '../building/building-details/building-details.service';
import { Building } from '../../model/building';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../../../../shared/customvalidations/validation.service';
import { CreateBuildingService } from '../building/create-building/create-building.service';

@Component({
  moduleId: module.id,
  selector: 'bi-cost-summary-project-report',
  templateUrl: 'cost-summary.component.html',
  styleUrls: ['cost-summary.component.css'],
})

export class CostSummaryComponent implements OnInit {

  projectBuildings: any;
  projectId: string;
  buildingId: string;
  cloneBuildingId: string;
  currentBuildingId:string;
  costHeadId: number;

  grandTotalofBudgetedCost: number;
  grandTotalofTotalRate: number;
  grandTotalofArea: number;
  grandTotalofEstimatedCost : number;
  grandTotalofEstimatedRate : number;

  buildingName : string;
  buildingsDetails: any;
  estimatedCost : any;
  costHead: string;
  costHeadName: string;
  estimatedItem: any;
  showCostHeadList:boolean=false;
  showGrandTotalPanelBody:boolean=true;
  compareIndex:number=0;

 public inActiveCostHeadArray:any;
  cloneBuildingForm: FormGroup;
  model: Building = new Building();
  clonedBuildingDetails: any;

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

  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute,
              private formBuilder: FormBuilder, private _router : Router, private messageService : MessageService,
              private listBuildingService: BuildingListService, private createBuildingService: CreateBuildingService,
              private viewBuildingService : BuildingDetailsService) {
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
        this.onChangeCostingIn(this.defaultCostIn);
      }
    });
  }


  setBuildingId(buildingId: string, i:number) {
    this.compareIndex = i;
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
  }

  showInactiveCostHeadsOnDropDown(buildingId: string) {
    this.buildingId=buildingId;
    this.costSummaryService.getInactiveCostHeads(this.projectId,this.buildingId).subscribe(
      inActiveCostHeads => this.onGetInactiveCostHeadsSuccess(inActiveCostHeads),
      error => this.onGetInactiveCostHeadsFailure(error)
    );
  }


  onGetInactiveCostHeadsSuccess(inActiveCostHeads : any) {
      this.inActiveCostHeadArray=inActiveCostHeads.data;
      this.showCostHeadList=true;
  }

  onGetInactiveCostHeadsFailure(error : any) {
    console.log(error);
  }

  getAmount(buildingName:string, buildingId : string, estimatedItem :any) {
    this.estimatedItem = estimatedItem;
    this.costHeadId = estimatedItem.rateAnalysisId;
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
    this.buildingId =  SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    this._router.navigate([NavigationRoutes.APP_PROJECT, this.projectId, NavigationRoutes.APP_BUILDING, buildingName,
      NavigationRoutes.APP_COST_SUMMARY, NavigationRoutes.APP_COST_HEAD, estimatedItem.name, this.costHeadId]);
  }
  getCommonAmenities() {
   this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    this._router.navigate([NavigationRoutes.APP_PROJECT,this.projectId,NavigationRoutes.APP_COMMON_AMENITIES]);
}

  getBuildingDetails() {
    this.costSummaryService.getBuildingDetails(this.projectId).subscribe(
      buildingDetails => this.onGetbuildingDetailsCostSummarySuccess(buildingDetails),
      error => this.onGetbuildingDetailsCostSummaryFail(error)
    );
  }

  onGetbuildingDetailsCostSummarySuccess(buildingDetails : any) {
    this.buildingsDetails = buildingDetails.data;
  }

  onGetbuildingDetailsCostSummaryFail(error : any) {
    console.log(error);
  }

  onChangeCostingIn(costInId:any) {
    if(costInId) {
      this.defaultCostIn=costInId;
    }
    this.costSummaryService.getCost(this.projectId,this.defaultCostIn,this.defaultCostPer).subscribe(
      projectCostIn => this.onGetCostInSuccess(projectCostIn),
      error => this.onGetCostInFail(error)
    );

  }
  onGetCostInSuccess(projects : any) {
    this.projectBuildings = projects.data;
    this.makeGrandTotal();
  }

  onGetCostInFail(error : any) {
    console.log('onGetCostInFail()'+error);
  }

  onChangeCostingPer(costPerId:any) {
    this.defaultCostPer=costPerId;

    this.costSummaryService.getCost(this.projectId,this.defaultCostIn,this.defaultCostPer).subscribe(
      projectCostPer => this.onGetCostPerSuccess(projectCostPer),
      error => this.onGetCostPerFail(error)
    );
  }

  onGetCostPerSuccess(projects : any) {
    this.projectBuildings = projects.data;

    this.makeGrandTotal();
  }

  onGetCostPerFail(error : any) {
    console.log('onGetCostPerFail()'+error);
  }

  deleteCostHeadDetailsfun(buildingId: string, costHeadId: number) {
    this.buildingId = buildingId;
    this.costHeadId = costHeadId;
  }

  deleteCostHeadDetails() {
    this.costSummaryService.deleteCostHead(this.buildingId, this.costHeadId).subscribe(
        costHeadDetail => this.onDeleteCostHeadSuccess(costHeadDetail),
        error => this.onDeleteCostHeadFail(error)
      );
    }

  onDeleteCostHeadSuccess(costHeadDetail: any) {
    this.onChangeCostingIn(this.defaultCostIn);
     if ( costHeadDetail!== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DELETE_COSTHEAD;
      this.messageService.message(message);
    }
  }

  onDeleteCostHeadFail(error: any) {
    console.log(error);
  }

  inactiveCostHeadSelected(selectedInactiveCostHeadId:number) {
    this.showCostHeadList=false;
    this.costSummaryService.addInactiveCostHead(selectedInactiveCostHeadId,this.projectId,this.buildingId).subscribe(
      inActiveCostHeads => this.onAddInactiveCostHeadSuccess(inActiveCostHeads),
      error => this.onAddInactiveCostHeadFailure(error)
    );
  }


  onAddInactiveCostHeadSuccess(inActiveCostHeads : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_COSTHEAD;
    this.messageService.message(message);
    this.onChangeCostingIn(this.defaultCostIn);
  }

  onAddInactiveCostHeadFailure(error : any) {
    console.log('onAddInactiveCostHeadFailure()'+error);
  }

  changeBudgetedCost(buildingId: string, costHead: string, amount: number, buildingArea : number) {
    if (amount !== null) {
      let costIn : string;
      let costPer : string;
      (this.defaultCostIn==='Rs/Sqft') ? costIn = 'sqft' : costIn = 'sqmt';
      (this.defaultCostPer==='SlabArea') ? costPer = 'slabArea' : costPer = 'saleableArea';

      this.costSummaryService.updateBudgetCostAmountForCostHead(buildingId, costHead, costIn, costPer, buildingArea, amount).subscribe(
        buildingDetails => this.updatedCostHeadAmountSuccess(buildingDetails),
        error => this.updatedCostHeadAmountFail(error)
      );
    }
  }

  updatedCostHeadAmountSuccess(buildingDetails : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_BUDGETED_COST_COSTHEAD;
    this.messageService.message(message);
    this.onChangeCostingIn(this.defaultCostIn);
  }

  updatedCostHeadAmountFail(error : any) {
    console.log('onAddCostheadSuccess : '+error);
  }

  deleteBuildingFunction(buildingId : string) {
    this.currentBuildingId = buildingId;
  }

    deleteThisBuilding() {
    this.listBuildingService.deleteBuildingById( this.currentBuildingId).subscribe(
      project => this.onDeleteBuildingSuccess(project),
      error => this.onDeleteBuildingFail(error)
    );
  }

  onDeleteBuildingSuccess(result : any) {
    if (result !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DELETE_BUILDING;
      this.messageService.message(message);
      this.onChangeCostingIn(this.defaultCostIn);
      }
  }
  onDeleteBuildingFail(error : any) {
    console.log(error);
  }

  addBuilding() {
    this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
  }

  editBuildingDetails(buildingId: string) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
    this._router.navigate([NavigationRoutes.APP_VIEW_BUILDING_DETAILS, buildingId]);
  }

  cloneBuilding(buildingId: string) {
    this.viewBuildingService.getBuildingDetails(buildingId).subscribe(
      building => this.onGetBuildingDataSuccess(building),
      error => this.onGetBuildingDataFail(error)
    );
  }

  onGetBuildingDataSuccess(building: any) {
    let buildingDetails = building.data;
    this.clonedBuildingDetails = building.data.costHeads;
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
  }

  onGetBuildingDataFail(error: any) {
    console.log(error);
  }

  cloneBuildingBasicDetails() {
    if (this.cloneBuildingForm.valid) {
      this.model = this.cloneBuildingForm.value;
      this.createBuildingService.addNewBuilding(this.model)
        .subscribe(
          building => this.onAddNewBuildingSuccess(building),
          error => this.onAddNewBuildingFailure(error));
    }
  }

  onAddNewBuildingSuccess(building: any) {
    this.cloneBuildingId = building.data._id;
  }

  onAddNewBuildingFailure(error: any) {
    console.log(error);
  }

  updateThisBuilding(cloneCostHead: any) {
    this.listBuildingService.updateBuildingByCostHead(cloneCostHead, this.cloneBuildingId).subscribe(
      project => this.onUpdateBuildingByCostHeadSuccess(project),
      error => this.onUpdateBuildingByCostHeadFailure(error)
    );
  }

  onUpdateBuildingByCostHeadSuccess(project: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
    this.messageService.message(message);
    this.onChangeCostingIn(this.defaultCostIn);
  }

  onUpdateBuildingByCostHeadFailure(error: any) {
    console.log(error);
  }

  makeGrandTotal() {
    //ToDo we have to remove this code after
    this.grandTotalofBudgetedCost = 0;
    this.grandTotalofTotalRate = 0;
    this.grandTotalofArea = 0;

    this.grandTotalofEstimatedCost = 0;
    this.grandTotalofEstimatedRate = 0;

    for (let buildindIndex = 0; buildindIndex < this.projectBuildings.length; buildindIndex++) {

      this.grandTotalofBudgetedCost = this.grandTotalofBudgetedCost +
        parseFloat(this.projectBuildings[buildindIndex].thumbRule.totalBudgetedCost);

      this.grandTotalofTotalRate = this.grandTotalofTotalRate + parseFloat(this.projectBuildings[buildindIndex].thumbRule.totalRate);

      this.grandTotalofArea =( this.grandTotalofArea + parseFloat(this.projectBuildings[buildindIndex].area));

      this.grandTotalofEstimatedCost = this.grandTotalofEstimatedCost +
        parseFloat(this.projectBuildings[buildindIndex].estimated.totalEstimatedCost);

      this.grandTotalofEstimatedRate = this.grandTotalofEstimatedRate +
        parseFloat(this.projectBuildings[buildindIndex].estimated.totalRate);
    }
  }

  toggleShowGrandTotalPanelBody() {
    this.showGrandTotalPanelBody=!this.showGrandTotalPanelBody;
  }

  showGrandTotalBody() {
    this.toggleShowGrandTotalPanelBody();
  }

}
