import {Component, Input, OnChanges, Output, EventEmitter} from "@angular/core";
import {ProfileComparisonService} from "./profile-comparison.service";
import {ProfileComparison, ProfileComparisonData, CompareEntityDetails} from "../model/profile-comparison";
//TODO Abhijeet import {EventEmitter} from "@angular/common/src/facade/async";


@Component({
  moduleId:module.id,
  selector:'cn-profile-comparison',
  templateUrl:'profile-comparison.component.html',
    styleUrls: ['profile-comparison.component.css']
})

export class ProfileComparisonComponent implements OnChanges {

  @Input() profileComparison:ProfileComparison;
  @Output() performActionOnComparisonList = new EventEmitter();
  profileComparisonData: ProfileComparisonData[] = new Array(0);
  private profileComparisonJobData: CompareEntityDetails = new CompareEntityDetails();

  constructor(private profileComparisonService:ProfileComparisonService) {

  }


  ngOnChanges(changes: any) {
    if (changes.profileComparison.currentValue != undefined) {
      this.profileComparisonData = changes.profileComparison.currentValue.profileComparisonData;
      this.profileComparisonJobData = changes.profileComparison.currentValue.profileComparisonJobData;
    }
  }

  actionOnComparisonList(value:any) {
    this.performActionOnComparisonList.emit(value);
    /*if(data.action = 'Remove') {
     this.profileComparisonData.splice(data.value,1);
     }*/
  }
}
