import {Component, OnInit} from '@angular/core';


@Component({
    moduleId:module.id,
    selector:'cn-relevent-industry-list',
    templateUrl:'relevent-industry-list.component.html',
    styleUrls:['relevent-industry-list.component.css']
})

export class ReleventIndustryListComponent implements OnInit {
  industries = [ {name:'ABC'},{name:'XYZ'},{name:'PQR'}]
  constructor() {

  }

  ngOnInit() {

    this.getReleventIndustries();

  }
  getReleventIndustries() {

  }
}
