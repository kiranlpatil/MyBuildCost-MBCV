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
  estimatedCost : any;


  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute,
              private _router : Router) {
  }

  ngOnInit() {
    console.log('Inside Project Cost Sumamry Project');
    this.estimatedCost = 1650000;
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      if(this.projectId) {
        this.getProjects();
      }
    });
  }

  onSubmit() {
  }

  getAmount() {
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    this._router.navigate([NavigationRoutes.APP_COST_HEAD, this.projectId]);
  }

  getProjects() {
    this.costSummaryService.getProjectDetails(this.projectId).subscribe(
      projectCostSummary => this.onGetProjectCostSummarySuccess(projectCostSummary),
      error => this.onGetProjectCostSummaryFail(error)
    );
  }

  onGetProjectCostSummarySuccess(projects : any) {
    this.projectBuildings = projects.data[0].building;
  }

  onGetProjectCostSummaryFail(error : any) {
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
}
