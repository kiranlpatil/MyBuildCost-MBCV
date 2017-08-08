import {Component} from "@angular/core";
import {Router} from "@angular/router";


@Component({
  moduleId: module.id,
  selector: 'cn-value-portrait-container',
  templateUrl: 'value-portrait-container.component.html',
  styleUrls: ['value-portrait-container.component.css'],
})

export class ValuePortraitContainerComponent {
  constructor(private _router: Router) {
  }

  navigateTo(nav: string) {
    if (nav !== undefined) {
      this._router.navigate([nav]);
    }
  }
}
