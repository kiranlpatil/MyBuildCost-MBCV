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
  elementWiseReport : string;
  element : string;
  elementHeading : string;
  building : string;

  costHeadList: Array<string>;
  materialList: Array<string>;
  buildingList: Array<string>;
  elementWiseReportList: Array<string>;
  elementList : Array<string>;

  materialTakeOffReport :any;

  constructor( private activatedRoute:ActivatedRoute,  private _router : Router, private materialTakeoffService : MaterialTakeoffService) {
  this.elementWiseReportList = [
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
    this.elementWiseReport = MaterialTakeOffElements.COST_HEAD_WISE;

    this.costHeadList = list.costHeadList;
    this.materialList = list.materialList;
    this.elementHeading = MaterialTakeOffElements.COST_HEAD;
    this.elementList = this.costHeadList;
    this.element = this.costHeadList[0];

    this.buildingList = list.buildingList;
    this.building = this.buildingList[0];

    this.buildMaterialTakeOffReport(this.elementWiseReport, this.element, this.building);

  }

  onChangeGroupBy(groupBy : string) {
    this.elementWiseReport = groupBy;
    if(this.elementWiseReport === MaterialTakeOffElements.COST_HEAD_WISE) {
      this.elementList = this.costHeadList;
      this.elementHeading = MaterialTakeOffElements.COST_HEAD;
      this.element = this.costHeadList[0];
    } else {
      this.elementList = this.materialList;
      this.elementHeading = MaterialTakeOffElements.MATERIAL;
      this.element = this.materialList[0];
    }

    this.buildMaterialTakeOffReport(this.elementWiseReport, this.element, this.building);

  }

  onChangeSecondFilter(secondFilter : string) {
    this.element = secondFilter;
    this.buildMaterialTakeOffReport(this.elementWiseReport, this.element, this.building);
  }

  onChangeBuilding(building : string) {
    this.building = building;
    this.buildMaterialTakeOffReport(this.elementWiseReport, this.element, this.building);
  }

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  buildMaterialTakeOffReport(groupBy : string, secondaryFilter : string, building : string) {
    if(groupBy === MaterialTakeOffElements.COST_HEAD_WISE && building === MaterialTakeOffElements.ALL_BUILDINGS) {
      this.getMaterialTakeOffReport( MaterialTakeOffElements.ELEMENT_WISE_REPORT_COST_HEAD,
        this.element, this.building);
    } else if(groupBy === MaterialTakeOffElements.COST_HEAD_WISE && building !== MaterialTakeOffElements.ALL_BUILDINGS) {
      this.getMaterialTakeOffReport( MaterialTakeOffElements.ELEMENT_WISE_REPORT_COST_HEAD,
        this.element, this.building);
    } else if(groupBy === MaterialTakeOffElements.MATERIAL_WISE && building === MaterialTakeOffElements.ALL_BUILDINGS) {
      this.getMaterialTakeOffReport( MaterialTakeOffElements.ELEMENT_WISE_REPORT_MATERIAL,
        this.element, this.building);
    } else if(groupBy === MaterialTakeOffElements.MATERIAL_WISE && building !== MaterialTakeOffElements.ALL_BUILDINGS) {
      this.getMaterialTakeOffReport( MaterialTakeOffElements.ELEMENT_WISE_REPORT_MATERIAL,
        this.element, this.building);
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
