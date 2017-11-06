import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Button, Label, LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";


@Component({
  moduleId: module.id,
  selector: 'cn-value-portrait-container',
  templateUrl: 'value-portrait-container.component.html',
  styleUrls: ['value-portrait-container.component.css'],
})

export class ValuePortraitContainerComponent implements OnInit {

  _userId:string;
  isShareView:boolean = false;
  private isCandidate: boolean;
  private isCandidateSubmitted: boolean;
  private isFromCreate: boolean = false;

  constructor(private _router:Router, private activatedRoute:ActivatedRoute) {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE_SUBMITTED) === 'true') {
    this.isCandidateSubmitted = true;
    }
  }

  navigateTo() {
    var role = LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE);
    var isAdmin = LocalStorageService.getLocalValue(LocalStorage.ISADMIN);
    if(isAdmin) {
      this._router.navigate(['/admin_dashboard']);
    }
    if (role === 'true') {
      if(this.isFromCreate) {
        this.isFromCreate=false;
        this._router.navigate(['/create_profile']);
      }
      else {
        this._router.navigate(['/candidate_dashboard']);
      }
    }
    if (role === 'false') {
      this._router.navigate(['/recruiterdashboard', 'applicant_search']);
    }

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this._userId = params['id'];
      this.isFromCreate=false;
    });
    this.activatedRoute.params.subscribe(params => {
      console.log(params['userId']);
      if(params['userId']){
        this.isFromCreate = true;
        this._userId = params['userId'];
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      var token = params['access_token'];
      if (token) {
        this.isShareView = true;
      }
    });

  }

  routeToSignUpPage() {
    this._router.navigate(['/applicant-signup','new_user']);
  }

  getLabel() {
    return Label;
  }

  getButtons() {
    return Button;
  }
}
