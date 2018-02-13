import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import {
  AppSettings,
  Label,
  Button,
  Headings,
  NavigationRoutes
} from '../../../../shared/constants';
import { API, BaseService, SessionStorage, SessionStorageService,  Message,
  Messages, MessageService } from '../../../../shared/index';
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
  buildingName : string;
  buildingsDetails: any;
  estimatedCost : any;
  costHead: string;
  costHeadDetails :any;
  estimatedItem: any;
  buildingIndex:number;
  showCostHeadList:boolean=false;

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


  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute, private formBuilder: FormBuilder, private _router : Router, private messageService : MessageService, private listBuildingService: BuildingListService,
              private createBuildingService: CreateBuildingService, private viewBuildingService : BuildingDetailsService) {
    this.cloneBuildingForm = this.formBuilder.group({
      'name': ['', ValidationService.requiredBuildingName],
      'totalSlabArea':['', ValidationService.requiredSlabArea],
      'totalCarperAreaOfUnit':['', ValidationService.requiredCarpetArea],
      'totalSaleableAreaOfUnit':['', ValidationService.requiredSalebleArea],
      'plinthArea':['', ValidationService.requiredPlinthArea],
      'totalNoOfFloors':['', ValidationService.requiredNoOfFloors],
      'noOfParkingFloors':['', ValidationService.requiredNoOfParkingFloors],
      'carpetAreaOfParking':['', ValidationService.requiredCarpetAreaOfParking],
      'noOfOneBHK': ['',  ValidationService.requiredOneBHK],
      'noOfTwoBHK':['', ValidationService.requiredTwoBHK],
      'noOfThreeBHK':['', ValidationService.requiredThreeBHK],
      'noOfFourBHK':['', ValidationService.requiredFourBHK],
      'noOfFiveBHK':['', ValidationService.requiredFiveBHK],
      'noOfLift':['', ValidationService.requiredNoOfLifts],
    });
  }

  ngOnInit() {
    console.log('Inside Project Cost Sumamry Project');
    /*this.estimatedCost = 1650000;*/
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      console.log(' this.projectId ->'+ this.projectId);
      if(this.projectId) {
        this.onChangeCostingIn(this.defaultCostIn);
      }
    });
  }


  setBuildingId(buildingId: string) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
  }

  showInactiveCostHeadsOnDropDown(buildingId: string) {
    console.log('Adding Costhead');
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

  getAmount(buildingName:string, estimatedItem :any) {
    this.estimatedItem = estimatedItem.data;
    this.costHeadId = estimatedItem.rateAnalysisId;
   this.buildingId =  SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    this._router.navigate([NavigationRoutes.APP_COST_HEAD, this.projectId, buildingName, estimatedItem.name, this.costHeadId]);
  }
  getCommonAmenities() {
   this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    this._router.navigate([NavigationRoutes.APP_COMMON_AMENITIES,this.projectId]);
}
  getProjects() {
    this.costSummaryService.getProjectDetails(this.projectId).subscribe(
      projectCostSummary => this.onGetProjectCostSummarySuccess(projectCostSummary),
      error => this.onGetProjectCostSummaryFail(error)
    );
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

  onGetProjectCostSummarySuccess(projects : any) {
    this.projectBuildings = projects.data[0].building;
  }

  onGetProjectCostSummaryFail(error : any) {
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
    console.log('costPerId : '+costPerId);
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
  deleteCostHeadDetailsfun(buildingId: string, costHead: string) {
    this.buildingId = buildingId;
    this.costHead = costHead;
  }

  deleteCostHeadDetails() {
      this.costSummaryService.deleteQuanatityDetails(this.buildingId, this.costHead).subscribe(
        costHeadDetail => this.onDeleteQuantitySuccess(costHeadDetail),
        error => this.onDeleteQuantityFail(error)
      );
    }

  onDeleteQuantitySuccess(costHeadDetail: any) {
    this.onChangeCostingIn(this.defaultCostIn);
     if ( costHeadDetail!== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DELETE_COSTHEAD;
      this.messageService.message(message);
      /* this.costSummaryService.onCostHeadUpdate(costHeadDetail);*/
    }
  }

  onDeleteQuantityFail(error: any) {
    console.log(error);
  }

  inactiveCostHeadSelected(selectedinActiveCostHead:string) {
    this.showCostHeadList=false;
    this.costSummaryService.addInactiveCostHead(selectedinActiveCostHead,this.projectId,this.buildingId).subscribe(
      inActiveCostHeads => this.onAddInactiveCostHeadSuccess(inActiveCostHeads),
      error => this.onAddInactiveCostHeadFailure(error)
    );
  }


  onAddInactiveCostHeadSuccess(inActiveCostHeads : any) {
    console.log('onAddCostheadSuccess ->'+inActiveCostHeads);
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_COSTHEAD;
    this.messageService.message(message);
    this.onChangeCostingIn(this.defaultCostIn);
  }

  onAddInactiveCostHeadFailure(error : any) {
    console.log('onAddCostheadSuccess()'+error);
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
      console.log(result);
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
    this.clonedBuildingDetails = building.data.costHead;
    this.model.name = buildingDetails.name;
    this.model.totalSlabArea = buildingDetails.totalSlabArea;
    this.model.totalCarperAreaOfUnit = buildingDetails.totalCarperAreaOfUnit;
    this.model.totalSaleableAreaOfUnit = buildingDetails.totalSaleableAreaOfUnit;
    this.model.plinthArea = buildingDetails.plinthArea;
    this.model.totalNoOfFloors = buildingDetails.totalNoOfFloors;
    this.model.noOfParkingFloors = buildingDetails.noOfParkingFloors;
    this.model.carpetAreaOfParking = buildingDetails.carpetAreaOfParking;
    this.model.noOfOneBHK = buildingDetails.noOfOneBHK;
    this.model.noOfTwoBHK = buildingDetails.noOfTwoBHK;
    this.model.noOfThreeBHK = buildingDetails.noOfThreeBHK;
    this.model.noOfFourBHK = buildingDetails.noOfFourBHK;
    this.model.noOfFiveBHK = buildingDetails.noOfFiveBHK;
    this.model.noOfLift = buildingDetails.noOfLift;
  }

  onGetBuildingDataFail(error: any) {
    console.log(error);
  }

  cloneBuildingBasicDetails() {
    if (this.cloneBuildingForm.valid) {
      this.model = this.cloneBuildingForm.value;
      this.createBuildingService.addBuilding(this.model)
        .subscribe(
          building => this.addNewBuildingSuccess(building),
          error => this.addNewBuildingFailed(error));
    }
  }

  addNewBuildingSuccess(building: any) {
    this.cloneBuildingId = building.data._id;
  }

  addNewBuildingFailed(error: any) {
    console.log(error);
  }

  updateThisBuilding(cloneCostHead: any) {
    this.listBuildingService.updateBuildingByCostHead(cloneCostHead, this.cloneBuildingId).subscribe(
      project => this.updateBuildingSuccess(project),
      error => this.updateBuildingFail(error)
    );
  }

  updateBuildingSuccess(project: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
    this.messageService.message(message);
    this.onChangeCostingIn(this.defaultCostIn);
  }

  updateBuildingFail(error: any) {
    console.log(error);
  }

  makeGrandTotal() {
    //ToDo we have to remove this code after
    this.grandTotalofBudgetedCost = 0;
    this.grandTotalofTotalRate = 0;
    this.grandTotalofArea = 0;
    for (let buildindIndex = 0; buildindIndex < this.projectBuildings.length; buildindIndex++) {
      this.grandTotalofBudgetedCost = this.grandTotalofBudgetedCost + this.projectBuildings[buildindIndex].thumbRule.totalBudgetedCost;
      this.grandTotalofTotalRate = this.grandTotalofTotalRate + this.projectBuildings[buildindIndex].thumbRule.totalRate;
      this.grandTotalofArea = this.grandTotalofArea + this.projectBuildings[buildindIndex].area;
    }
  }

}
