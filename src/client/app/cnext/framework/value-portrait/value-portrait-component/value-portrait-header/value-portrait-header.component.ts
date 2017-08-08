import {Component, Input} from "@angular/core";
import {Candidate} from "../../../model/candidate";
import {AppSettings} from "../../../../../framework/shared/constants";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'cn-value-portrait-header',
  templateUrl: 'value-portrait-header.component.html',
  styleUrls: ['value-portrait-header.component.css'],
})

export class ValuePortraitHeader {

  @Input() private candidate: Candidate;

  constructor(private _router: Router) {

  }

  getImagePath(imagePath: string) {
    if (imagePath != undefined) {
      return AppSettings.IP + imagePath.substring(4).replace('"', '');
    }
    return null;
  }

}
