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
  buildingsDetails: any;
  estimatedCost : any;
  costHead: string;
  costHeadDetails :any;
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

  showCostHead(buildingId:any,i:number) {
    console.log('Adding Costhead');
    this.buildingIndex=i;
    this.buildingId=buildingId;
    this.costSummaryService.getCosthead(this.projectId,this.buildingId).subscribe(
      inActiveCostHeads => this.onGetCostheadSuccess(inActiveCostHeads),
      error => this.onGetCostheadFail(error)
    );
  }


  onGetCostheadSuccess(inActiveCostHeads : any) {
      this.inActiveCostHeadArray=inActiveCostHeads.data;
      this.showCostHeadList=true;
  }

  onGetCostheadFail(error : any) {
    console.log(error);
  }

  getAmount(buildingId:string,costHead:any,buildingName:string) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING , buildingId);
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    this._router.navigate([NavigationRoutes.APP_COST_HEAD, this.projectId, buildingName, costHead]);
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
      console.log('costInId : '+costInId);
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

  onSelectedinActiveCostHead(selectedinActiveCostHead:any) {
    console.log('Selected Item '+selectedinActiveCostHead);
    this.showCostHeadList=false;
    this.costSummaryService.addCosthead(selectedinActiveCostHead,this.projectId,this.buildingId).subscribe(
      inActiveCostHeads => this.onAddCostheadSuccess(inActiveCostHeads),
      error => this.onAddCostheadFail(error)
    );
  }


  onAddCostheadSuccess(inActiveCostHeads : any) {
    console.log('onAddCostheadSuccess ->'+inActiveCostHeads);
    this.onChangeCostingIn(this.defaultCostIn);
  }

  onAddCostheadFail(error : any) {
    console.log('onAddCostheadSuccess()'+error);
  }

}
