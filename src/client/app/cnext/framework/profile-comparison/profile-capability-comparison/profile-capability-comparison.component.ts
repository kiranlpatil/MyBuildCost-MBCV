import {Component, Input} from "@angular/core";
import {ProfileComparisonData} from "../../model/profile-comparison";

@Component({
  moduleId:module.id,
  selector:'cn-profile-capability-comparison',
  templateUrl:'profile-capability-comparison.component.html',
  styleUrls:['profile-capability-comparison.component.scss']

})

export class ProfileCapabilityComparisonComponent {
  //@Input() capabilityList: string[];
  @Input() profileComparisionResult:ProfileComparisonData[];
  constructor() {}
}
