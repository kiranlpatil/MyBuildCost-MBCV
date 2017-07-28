import {Component, Input} from "@angular/core";
import {Candidate} from "../../../model/candidate";
import {AppSettings} from "../../../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-value-portrait-header',
  templateUrl: 'value-portrait-header.component.html',
  styleUrls: ['value-portrait-header.component.css'],
})

export class ValuePortraitHeader {

  @Input() private candidate: Candidate;

  getImagePath(imagePath: string) {
    if (imagePath != undefined) {
      return AppSettings.IP + imagePath.substring(4).replace('"', '');
    }
    return null;
  }

}
