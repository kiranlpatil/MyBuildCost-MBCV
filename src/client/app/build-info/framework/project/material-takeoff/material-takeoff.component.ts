import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialTakeoffService } from './material-takeoff.service';
import { MaterialTakeOffElements } from '../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-material-takeoff-report',
  templateUrl: 'material-takeoff.component.html'
})

export class MaterialTakeoffComponent implements OnInit {

  projectId : string;
  groupBy : string;
  secondaryFilter : string;
  secondaryFilterHeading : string;
  building : string;

  costHeadList: Array<string>;
  materialList: Array<string>;
  buildingList: Array<string>;
  groupByList: Array<string>;
  secondaryFilterList : Array<string>;

  materialTakeOffReport :any;

  constructor( private activatedRoute:ActivatedRoute,  private _router : Router, private materialTakeoffService : MaterialTakeoffService) {
  this.groupByList = [
      MaterialTakeOffElements.COST_HEAD_WISE, MaterialTakeOffElements.MATERIAL_WISE
    ];
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
    this.materialFiltersList(this.projectId);
  }

  materialFiltersList(projectId : string) {
    this.materialTakeoffService.materialFiltersList(projectId).subscribe(
      materialFiltersList => this.onMaterialFiltersListSuccess(materialFiltersList),
      error => this.onMaterialFiltersListFailure(error)
    );
  }


  onMaterialFiltersListSuccess(materialFiltersList : Array<string>) {
    this.extractList(materialFiltersList);
  }

  onMaterialFiltersListFailure(error : any) {
    console.log(error);
  }

  extractList(list : any) {
    this.groupBy = MaterialTakeOffElements.COST_HEAD_WISE;

    this.costHeadList = list.costHeadList;
    this.materialList = list.materialList;
    this.secondaryFilterHeading = MaterialTakeOffElements.COST_HEAD;
    this.secondaryFilterList = this.costHeadList;
    this.secondaryFilter = this.costHeadList[0];

    this.buildingList = list.buildingList;
    this.building = this.buildingList[0];

    this.buildMaterialTakeOffReport(this.groupBy, this.secondaryFilter, this.building);

  }

  onChangeGroupBy(groupBy : string) {
    this.groupBy = groupBy;
    if(this.groupBy === MaterialTakeOffElements.COST_HEAD_WISE) {
      this.secondaryFilterList = this.costHeadList;
      this.secondaryFilterHeading = MaterialTakeOffElements.COST_HEAD;
      this.secondaryFilter = this.costHeadList[0];
    } else {
      this.secondaryFilterList = this.materialList;
      this.secondaryFilterHeading = MaterialTakeOffElements.MATERIAL;
      this.secondaryFilter = this.materialList[0];
    }

    this.buildMaterialTakeOffReport(this.groupBy, this.secondaryFilter, this.building);

  }

  onChangeSecondFilter(secondFilter : string) {
    this.secondaryFilter = secondFilter;
    this.buildMaterialTakeOffReport(this.groupBy, this.secondaryFilter, this.building);
  }

  onChangeBuilding(building : string) {
    this.building = building;
    this.buildMaterialTakeOffReport(this.groupBy, this.secondaryFilter, this.building);
  }

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  buildMaterialTakeOffReport(groupBy : string, secondaryFilter : string, building : string) {
    if(groupBy === MaterialTakeOffElements.COST_HEAD_WISE && building === MaterialTakeOffElements.ALL_BUILDINGS) {
      this.getMaterialTakeOffReport( MaterialTakeOffElements.ELEMENT_WISE_REPORT_COST_HEAD,
        this.secondaryFilter, this.building);
    } else if(groupBy === MaterialTakeOffElements.COST_HEAD_WISE && building !== MaterialTakeOffElements.ALL_BUILDINGS) {
      this.getMaterialTakeOffReport( MaterialTakeOffElements.ELEMENT_WISE_REPORT_COST_HEAD,
        this.secondaryFilter, this.building);
    } else if(groupBy === MaterialTakeOffElements.MATERIAL_WISE && building === MaterialTakeOffElements.ALL_BUILDINGS) {
      this.getMaterialTakeOffReport( MaterialTakeOffElements.ELEMENT_WISE_REPORT_MATERIAL,
        this.secondaryFilter, this.building);
    } else if(groupBy === MaterialTakeOffElements.MATERIAL_WISE && building !== MaterialTakeOffElements.ALL_BUILDINGS) {
      this.getMaterialTakeOffReport( MaterialTakeOffElements.ELEMENT_WISE_REPORT_MATERIAL,
        this.secondaryFilter, this.building);
    }
  }

  getMaterialTakeOffReport(elementWiseReport : string, element : string, building : string) {
    this.materialTakeoffService.getMaterialTakeOffReport(this.projectId, elementWiseReport, element, building).subscribe(
      materialTakeOffReport => this.onGetMaterialTakeOffReportSuccess(materialTakeOffReport),
      error => this.onGetMaterialTakeOffReportFailure(error)
    );
  }

  onGetMaterialTakeOffReportSuccess(materialTakeOffReport : any) {
    this.materialTakeOffReport = materialTakeOffReport;
  }

  onGetMaterialTakeOffReportFailure(error : any) {
    console.log(error);
  }
}
