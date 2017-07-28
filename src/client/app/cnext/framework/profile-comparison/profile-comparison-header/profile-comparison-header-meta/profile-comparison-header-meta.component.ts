import {Component, Input, OnChanges, OnInit, Output} from "@angular/core";
import {EventEmitter} from "@angular/common/src/facade/async";
import {ProfileComparisonHeaderMeta} from "./profile-comparison-header-meta";

@Component({
  moduleId:module.id,
  selector:'cn-profile-comparison-header-meta',
  templateUrl:'profile-comparison-header-meta.component.html',
    styleUrls: ['profile-comparison-header-meta.component.css']

})

export class ProfileComparisonHeaderMetaComponent implements OnChanges, OnInit {

   @Input() profileMeta: ProfileComparisonHeaderMeta;
  @Input() matchingPercentage: number;
   @Output() actionOnComparisonList = new EventEmitter();
  imagePath: string;

  constructor() {}

  ngOnChanges(changes: any) {
    if (changes.profileMeta.currentValue != undefined) {
      this.assignProfile();
    }
  }

  ngOnInit() {
    this.assignProfile();
  }

  assignProfile() {
    if (this.profileMeta.picture) {
      //this.imagePath = AppSettings.IP +'/'+ this.profileMeta.picture.replace('"',' ');
      this.imagePath = "assets/framework/images/dashboard/profile.png";
    } else {
      this.imagePath = "assets/framework/images/dashboard/profile.png";
    }
  }
  actionToPerformOnCompare() {
    this.actionOnComparisonList.emit();
  }
}
