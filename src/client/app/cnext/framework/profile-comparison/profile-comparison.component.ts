import {Component, Input, OnChanges, Output} from "@angular/core";
import {ProfileComparisonService} from "./profile-comparison.service";
import {ProfileComparison} from "../model/profile-comparison";
import {EventEmitter} from "@angular/common/src/facade/async";

@Component({
  moduleId:module.id,
  selector:'cn-profile-comparison',
  templateUrl:'profile-comparison.component.html',
  styleUrls:['profile-comparison.component.scss']
})

export class ProfileComparisonComponent implements OnChanges {

  @Input() profileComparison:ProfileComparison;
  @Output() performActionOnComparisonList = new EventEmitter();

  constructor(private profileComparisonService:ProfileComparisonService) {

  }


  ngOnChanges() {}

  actionOnComparisonList(value:any) {
  this.performActionOnComparisonList.emit();
  }

}
