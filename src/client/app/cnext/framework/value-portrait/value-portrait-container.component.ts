import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";


@Component({
  moduleId: module.id,
  selector: 'cn-value-portrait-container',
  templateUrl: 'value-portrait-container.component.html',
  styleUrls: ['value-portrait-container.component.css'],
})

export class ValuePortraitContainerComponent implements OnInit,OnDestroy {

  _userId:string;
  isShareView:boolean = false;
  private isCandidate: boolean;

  constructor(private _router:Router, private activatedRoute:ActivatedRoute) {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
  }

  navigateTo() {
    var role = LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE);
    var isAdmin = LocalStorageService.getLocalValue(LocalStorage.ISADMIN);
    if(isAdmin) {
      this._router.navigate(['/admin_dashboard']);
    }
    if (role === 'true') {
      this._router.navigate(['/candidate_dashboard']);
    }
    if (role === 'false') {
      this._router.navigate(['/recruiterdashboard', 'applicant_search']);
    }

  }

  ngOnDestroy() {
    if (this.isShareView) {
      LocalStorageService.removeLocalValue(LocalStorage.ACCESS_TOKEN);
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this._userId = params['id'];
    });

    this.activatedRoute.queryParams.subscribe(params => {
      var token = params['access_token'];
      if (token) {
        this.isShareView = true;
        LocalStorageService.setLocalValue(LocalStorage.ACCESS_TOKEN, token);
      }
    });

  }

  routeToSignUpPage() {
    this._router.navigate(['/applicant-signup','new_user']);
  }

}
