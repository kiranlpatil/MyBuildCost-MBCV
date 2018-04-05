import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialTakeoffService } from './material-takeoff.service';
import { MaterialTakeOffReport } from '../../model/material-take-off-report';
import { MaterialTakeOffElements } from '../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-material-takeoff-report',
  templateUrl: 'material-takeoff.component.html'
})

export class MaterialTakeoffComponent implements OnInit {

  projectId : string = null;
  groupBy : string = MaterialTakeOffElements.COST_HEAD_WISE;
  secondaryFilter : string;
  secondaryFilterHeading : string = null;
  secondaryFilterList : any[];
  building : string;
  list : any;

  flatReport : any[];

  public costHeadList: any[];

  public materialList: any[];

  public buildingList: any[];

  public groupByList: any[];


  //Material details send to material total component
  materialTakeOffDetails :Array<MaterialTakeOffReport> = new Array<MaterialTakeOffReport>();

  constructor( private activatedRoute:ActivatedRoute,  private _router : Router, private materialTakeoffService : MaterialTakeoffService) {
  this.groupByList = [
      MaterialTakeOffElements.COST_HEAD_WISE, MaterialTakeOffElements.MATERIAL_WISE
    ];
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
    this.getList(this.projectId);
  }

  getList(projectId : string) {
    /*this.materialTakeoffService.getList(projectId).subscribe(
      flatReport => this.onGetListSuccess(flatReport),
      error => this.onGetListFailure(error)
    );*/
    /*this.flatReport = [
      {
        "building" : "Build1",
        "costHead" : "RCC",
        "workItem" : "Abc",
        'material' : "Cement",
        "label" : "Floor1",
        "quantity" : 12,
        "unit" : "sqm"
      },
      {
        "building" : "Build1",
        "costHead" : "External Plaster",
        "workItem" : "Abc",
        'material' : "Cement",
        "label" : "Floor1",
        "quantity" : 15,
        "unit" : "sqm"
      },
      {
        "building" : "Build1",
        "costHead" : "External Plaster",
        "workItem" : "Abc",
        'material' : "Sand",
        "label" : "Floor1",
        "quantity" : 76,
        "unit" : "sqm"
      },
      {
        "building" : "Build1",
        "costHead" : "RCC",
        "workItem" : "Abc",
        'material' : "Cement",
        "label" : "Floor1",
        "quantity" : 65,
        "unit" : "sqm"
      },
      {
        "building" : "Build1",
        "costHead" : "RCC",
        "workItem" : "Abc",
        'material' : "Cement",
        "label" : "Floor1",
        "quantity" : 34,
        "unit" : "sqm"
      }
    ];*/

    this.list = {
      "buildinglist": ["Build1", "Build2", "Build3", "Build4", "Build5"],
      "costheadlist": ["costhead1", "costhead2", "costhead3", "costhead4", "costhead5", "costhead6"],
      "materiallist": ["material1", "material2", "material3", "material4", "material5", "material6", "material7"]
    };

    this.extractList(this.list);
  }


/*  onGetListSuccess(flatReport : any) {

  }

  onGetListFailure(error : any) {
    console.log(error);
  }*/

  extractList(list : any) {
    this.buildingList = list.buildinglist;
    this.building = this.buildingList[0];

    this.costHeadList = list.costheadlist;
    this.secondaryFilterHeading = MaterialTakeOffElements.COST_HEAD;
    this.secondaryFilterList = this.costHeadList;
    this.secondaryFilter = this.costHeadList[0];

    this.materialList = list.materiallist;
  }

  onChangeGroupBy(groupBy : any) {
    this.groupBy = groupBy;
    console.log('Group By :'+this.groupBy);
    if(this.groupBy === MaterialTakeOffElements.COST_HEAD_WISE) {
      this.secondaryFilterList = this.costHeadList;
      this.secondaryFilterHeading = MaterialTakeOffElements.COST_HEAD;
    } else {
      this.secondaryFilterList = this.materialList;
      this.secondaryFilterHeading = MaterialTakeOffElements.MATERIAL;
    }

  }

  onChangeSecondFilter(secondFilter : any) {
    this.secondaryFilter = secondFilter;
    console.log('Second Filter :'+this.secondaryFilter);
  }

  onChangeBuilding(building : any) {
    this.building = building;
    console.log('Building :'+this.building);
  }

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }
}
