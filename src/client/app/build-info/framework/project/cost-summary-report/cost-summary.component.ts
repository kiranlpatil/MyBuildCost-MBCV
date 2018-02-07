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

@Component({
  moduleId: module.id,
  selector: 'bi-cost-summary-project-report',
  templateUrl: 'cost-summary.component.html'
})

export class CostSummaryComponent implements OnInit {

  projectBuildings: any;
  projectId: string;
  buildingId: string;
  costHeadId: number;
  buildingName : string;
  buildingsDetails: any;
  estimatedCost : any;
  costHead: string;
  costHeadDetails :any;
  estimatedItem: any;
  buildingIndex:number;
  showCostHeadList:boolean=false;

 public inActiveCostHeadArray:any;

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
              private _router : Router, private messageService : MessageService) {
  }

  ngOnInit() {
    console.log('Inside Project Cost Sumamry Project');
    this.estimatedCost = 1650000;
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      console.log(' this.projectId ->'+ this.projectId);
      if(this.projectId) {
        this.onChangeCostingIn(this.defaultCostIn);
      }
    });
  }

  onSubmit() {
    console.log('Insdide');
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
    //this.projectBuildings = projects.data[0].building;
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

  changeBudgetedCost(buildingId : string, costHead : string, amount:number) {
    if(amount !== null) {
      this.costSummaryService.updateBudgetCostAmountForCostHead(buildingId, costHead, amount).subscribe(
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
  }

  updatedCostHeadAmountFail(error : any) {
    console.log('onAddCostheadSuccess : '+error);
  }

}
