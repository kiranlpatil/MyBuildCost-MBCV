import {Component, OnInit} from '@angular/core';
import {ReleventIndustryListService} from "./relevent-industry-list.service";


@Component({
    moduleId:module.id,
    selector:'cn-relevent-industry-list',
    templateUrl:'relevent-industry-list.component.html',
    styleUrls:['relevent-industry-list.component.css']
})

export class ReleventIndustryListComponent implements OnInit {
  industries:String[] = new Array();
  constructor(private releventIndustryService:ReleventIndustryListService) {

  }

  ngOnInit() {

    this.getReleventIndustries();

  }
  getReleventIndustries() {
    this.releventIndustryService.getReleventIndustries()
      .subscribe(
        data => {
          this.onGetIndustriesSuccess(data);
        },
        error => {
          this.onError(error);
        });
  }
  onGetIndustriesSuccess(data:any) {
    this.industries = data.domains;
    console.log('--------data-----',data);
  }
  onError(error:any) {
  console.log('----errorr------');
  }
}
