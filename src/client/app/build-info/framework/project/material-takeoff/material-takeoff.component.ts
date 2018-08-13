import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialTakeOffService } from './material-takeoff.service';
import { MaterialTakeOffElements, CurrentView } from '../../../../shared/constants';
import { MaterialTakeOffFilters } from '../../model/material-take-off-filters';
import { MaterialTakeOffElement } from '../../model/material-take-off-element';
import { LoaderService, Message, Messages, MessageService, SessionStorage, SessionStorageService} from '../../../../shared/index';
import { ErrorService } from '../../../../shared/services/error.service';

declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'bi-material-takeoff-report',
  templateUrl: 'material-takeoff.component.html',
  styleUrls: ['material-takeoff.component.css']
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
  elementWiseReports: Array<MaterialTakeOffElement> = new Array<MaterialTakeOffElement>();
  elements : Array<string>;
  elementFound : boolean;
  isMaterialTakeOffReportPresent : boolean;

  materialTakeOffReport :any;

  constructor( private activatedRoute:ActivatedRoute,  private _router : Router, private materialTakeoffService : MaterialTakeOffService,
               private messageService : MessageService , private errorService:ErrorService, private loaderService : LoaderService) {

    let costHeadElement = new MaterialTakeOffElement();
    costHeadElement.elementKey = MaterialTakeOffElements.ELEMENT_WISE_REPORT_COST_HEAD;
    costHeadElement.elementValue = MaterialTakeOffElements.COST_HEAD_WISE;

    let materialElement = new MaterialTakeOffElement();
    materialElement.elementKey = MaterialTakeOffElements.ELEMENT_WISE_REPORT_MATERIAL;
      materialElement.elementValue = MaterialTakeOffElements.MATERIAL_WISE;

    this.elementWiseReports.push(costHeadElement);
    this.elementWiseReports.push(materialElement);
  }

  ngOnInit() {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_VIEW, CurrentView.MATERIAL_TAKE_OFF);
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
    this.getMaterialFiltersList(this.projectId);
  }

  showDropdown(e: any) {
    e.stopPropagation();
  }

  getMaterialFiltersList(projectId : string) {
    this.loaderService.start();
    this.materialTakeoffService.getMaterialFiltersList(projectId).subscribe(
      materialFiltersList => this.onGetMaterialFiltersListSuccess(materialFiltersList),
      error => this.onGetMaterialFiltersListFailure(error)
    );
  }


  onGetMaterialFiltersListSuccess(materialFiltersList : Array<string>) {
    this.loaderService.stop();
    this.extractList(materialFiltersList);
    if (this.selectedElement !== undefined && this.building !== undefined) {
      this.getMaterialTakeOffReport( MaterialTakeOffElements.ELEMENT_WISE_REPORT_COST_HEAD,
        this.selectedElement, this.building);
    }
  }

  onGetMaterialFiltersListFailure(error : any) {
    if(error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log(error);
  }

  extractList(list : any) {
    this.elementWiseReport = MaterialTakeOffElements.ELEMENT_WISE_REPORT_COST_HEAD;
    this.elementHeading = MaterialTakeOffElements.COST_HEAD;

    if (list.costHeadList.length > 0) {
      this.costHeads = list.costHeadList;
      this.elements = this.costHeads;
      this.selectedElement = this.costHeads[0];
    }
      if(list.materialList.length > 0) {
        this.materials = list.materialList;
      }

      if(list.buildingList.length > 0) {
        this.buildings = list.buildingList;
        this.building = this.buildings[0];
        this.isMaterialTakeOffReportPresent = true;
      } else {
        this.isMaterialTakeOffReportPresent = false;
      }
  }


  onChangeGroupBy(groupBy : string) {

    this.elementWiseReport = groupBy;
    if(this.elementWiseReport === MaterialTakeOffElements.ELEMENT_WISE_REPORT_COST_HEAD) {
      this.elements = this.costHeads;
      this.elementHeading = MaterialTakeOffElements.COST_HEAD;
    } else {
      this.elements = this.materials;
      this.elementHeading = MaterialTakeOffElements.MATERIAL;
    }
    this.selectedElement = this.elements[0];

    this.getMaterialTakeOffReport( this.elementWiseReport, this.selectedElement, this.building);

  }

  onChangeSecondFilter(selectedElement : string) {
    this.selectedElement = selectedElement;
    this.getMaterialTakeOffReport( this.elementWiseReport, this.selectedElement, this.building);
  }

  onChangeBuilding(building : string) {
    this.building = building;
    this.getMaterialTakeOffReport( this.elementWiseReport, this.selectedElement, this.building);
  }

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  getMessage() {
    return Messages;
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
    this.elementFound = true;

  }

  onGetMaterialTakeOffReportFailure(error : any) {
    this.elementFound = false;

    var message = new Message();
    message.isError = true;
    message.custom_message = error.err_msg;
    message.error_msg = error.err_msg;
    this.messageService.message(message);
  }
}
