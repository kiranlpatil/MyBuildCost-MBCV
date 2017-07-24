import {Component, Input, Output} from "@angular/core";
import {EventEmitter} from "@angular/common/src/facade/async";
import {ProfileComparisonHeaderMeta} from "./profile-comparison-header-meta";

@Component({
  moduleId:module.id,
  selector:'cn-profile-comparison-header-meta',
  templateUrl:'profile-comparison-header-meta.component.html',
  styleUrls:['profile-comparison-header-meta.component.scss']

})

export class ProfileComparisonHeaderMetaComponent {

   @Input() profileMeta: ProfileComparisonHeaderMeta;
   @Output() actionOnComparisonList = new EventEmitter();
  constructor() {}

  actionToPerformOnCompare() {
    this.actionOnComparisonList.emit();
  }
}
