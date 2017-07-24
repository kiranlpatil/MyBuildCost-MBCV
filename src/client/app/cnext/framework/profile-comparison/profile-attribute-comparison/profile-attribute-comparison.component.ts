import {Component, Input} from "@angular/core";
import {ProfileComparisonData} from "../../model/profile-comparison";

@Component({
  moduleId:module.id,
  selector:'cn-profile-attribute-comparison',
  templateUrl:'profile-attribute-comparison.component.html',
  styleUrls:['profile-attribute-comparison.component.scss']

})

export class ProfileAttributeComparisonComponent {
  @Input() profileComparisionResult:ProfileComparisonData[];
 constructor() {}
}
