import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialTakeOffService } from './material-takeoff.service';
import { MaterialTakeOffElements } from '../../../../shared/constants';
import { MaterialTakeOffFilters } from '../../model/material-take-off-filters';

@Component({
  moduleId: module.id,
  selector: 'bi-material-takeoff-report',
  templateUrl: 'material-takeoff.component.html'
})

export class MaterialTakeoffComponent implements OnInit {

  projectId : string;
  elementWiseReport : string;
  selectedElement : string;
  elementHeading : string;
  building : string;

  costHeads: Array<string>;
  materials: Array<string>;
  buildings: Array<string>;
  elementWiseReports: Array<string>;
  elements : Array<string>;

  materialTakeOffReport :any;

  constructor( private activatedRoute:ActivatedRoute,  private _router : Router, private materialTakeoffService : MaterialTakeOffService) {
  this.elementWiseReports = [
      MaterialTakeOffElements.COST_HEAD_WISE, MaterialTakeOffElements.MATERIAL_WISE
    ];
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
    this.getMaterialFiltersList(this.projectId);
  }

  getMaterialFiltersList(projectId : string) {
    this.materialTakeoffService.getMaterialFiltersList(projectId).subscribe(
      materialFiltersList => this.onGetMaterialFiltersListSuccess(materialFiltersList),
      error => this.onGetMaterialFiltersListFailure(error)
    );
  }


  onGetMaterialFiltersListSuccess(materialFiltersList : Array<string>) {
    this.extractList(materialFiltersList);
    this.buildMaterialTakeOffReport(this.elementWiseReport, this.selectedElement, this.building);
  }

  onGetMaterialFiltersListFailure(error : any) {
    console.log(error);
  }

  extractList(list : any) {
    this.elementWiseReport = MaterialTakeOffElements.COST_HEAD_WISE;

    this.costHeads = list.costHeadList;
    this.materials = list.materialList;
    this.elementHeading = MaterialTakeOffElements.COST_HEAD;
    this.elements = this.costHeads;
    this.selectedElement = this.costHeads[0];

    this.buildings = list.buildingList;
    this.building = this.buildings[0];

  }

  onChangeGroupBy(groupBy : string) {
    this.elementWiseReport = groupBy;
    if(this.elementWiseReport === MaterialTakeOffElements.COST_HEAD_WISE) {
      this.elements = this.costHeads;
      this.elementHeading = MaterialTakeOffElements.COST_HEAD;
    } else {
      this.elements = this.materials;
      this.elementHeading = MaterialTakeOffElements.MATERIAL;
    }
    this.selectedElement = this.elements[0];

    this.buildMaterialTakeOffReport(this.elementWiseReport, this.selectedElement, this.building);

  }

  onChangeSecondFilter(selectedElement : string) {
    this.selectedElement = selectedElement;
    this.buildMaterialTakeOffReport(this.elementWiseReport, this.selectedElement, this.building);
  }

  onChangeBuilding(building : string) {
    this.building = building;
    this.buildMaterialTakeOffReport(this.elementWiseReport, this.selectedElement, this.building);
  }

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  buildMaterialTakeOffReport(groupBy : string, selectedElement : string, building : string) {
    if(groupBy === MaterialTakeOffElements.COST_HEAD_WISE && building === MaterialTakeOffElements.ALL_BUILDINGS) {
      this.getMaterialTakeOffReport( MaterialTakeOffElements.ELEMENT_WISE_REPORT_COST_HEAD,
        this.selectedElement, this.building);
    } else if(groupBy === MaterialTakeOffElements.COST_HEAD_WISE && building !== MaterialTakeOffElements.ALL_BUILDINGS) {
      this.getMaterialTakeOffReport( MaterialTakeOffElements.ELEMENT_WISE_REPORT_COST_HEAD,
        this.selectedElement, this.building);
    } else if(groupBy === MaterialTakeOffElements.MATERIAL_WISE && building === MaterialTakeOffElements.ALL_BUILDINGS) {
      this.getMaterialTakeOffReport( MaterialTakeOffElements.ELEMENT_WISE_REPORT_MATERIAL,
        this.selectedElement, this.building);
    } else if(groupBy === MaterialTakeOffElements.MATERIAL_WISE && building !== MaterialTakeOffElements.ALL_BUILDINGS) {
      this.getMaterialTakeOffReport( MaterialTakeOffElements.ELEMENT_WISE_REPORT_MATERIAL,
        this.selectedElement, this.building);
    }
  }

  getMaterialTakeOffReport(elementWiseReport : string, selectedElement : string, building : string) {
    let materialTakeOffFilters = new MaterialTakeOffFilters(elementWiseReport, selectedElement, building);
    this.materialTakeoffService.getMaterialTakeOffReport(this.projectId, materialTakeOffFilters).subscribe(
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
