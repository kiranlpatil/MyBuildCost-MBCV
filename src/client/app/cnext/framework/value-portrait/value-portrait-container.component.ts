import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";


@Component({
  moduleId: module.id,
  selector: 'cn-value-portrait-container',
  templateUrl: 'value-portrait-container.component.html',
  styleUrls: ['value-portrait-container.component.css'],
})

export class ValuePortraitContainerComponent implements OnInit {
  _userId:string;

  constructor(private _router:Router, private activatedRoute:ActivatedRoute) {
  }

  navigateTo() {
    var role = LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE);
    if (role == 'true') {
      this._router.navigate(['/candidate_dashboard']);
    } else {
      this._router.navigate(['/recruiterdashboard', 'applicant_search']);
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this._userId = params['id'];
    });
  }
}
