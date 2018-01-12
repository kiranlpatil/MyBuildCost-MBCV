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
  Messages } from '../../../../shared/index';
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

  public costIn: any[] = [
    { 'costInId': 'Rs/Sqft'},
    { 'costInId': 'Rs/Sqmt'}
  ];

  public costPer: any[] = [
    { 'costPerId': 'SlabArea'},
    { 'costPerId': 'SalebleArea'}
  ];

  defaultCostIn:string='Rs/Sqft';
  defaultCostPer:string='SlabArea';



  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute,
              private _router : Router) {
  }

  ngOnInit() {
    console.log('Inside Project Cost Sumamry Project');
    this.estimatedCost = 1650000;
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      if(this.projectId) {
        this.onChangeCostingIn(this.defaultCostIn);
      }
    });
  }

  onSubmit() {
    console.log('Insdide');
  }

  addCostHead() {
    console.log('Adding Costhead');
  }

  getAmount(buildingId: string, costHead:string) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING , buildingId);
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    this._router.navigate([NavigationRoutes.APP_COST_HEAD,this.projectId, buildingId, costHead]);
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
}
