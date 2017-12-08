import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {LocalStorage} from "../../../shared/constants";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorService} from "../../../shared/services/error.service";
import {LoginComponent} from "../../../user/login/login.component";
import {AdminDashboardService} from "../admin-dashboard.service";
import {RegistrationService} from "../../../user/services/registration.service";

@Component ({
  moduleId: module.id,
  selector: 'cn-user-dashboard-container',
  templateUrl: 'user-dashboard-container.component.html',
  styleUrls: ['user-dashboard-container.component.css'],
})

export class UserDashboardContainerComponent implements OnInit {

  constructor(private _router:Router,
              private activatedRoute:ActivatedRoute,
              private errorService:ErrorService,
              private adminDashboardService: AdminDashboardService,private registrationService:RegistrationService) {
  }

  ngOnInit() {
    window.sessionStorage.clear();
    this.activatedRoute.queryParams.subscribe(params => {
      let token = params['token'];
      let userid = params['userid'];
      if (token && token !== '' && userid && userid !== '') {
        LocalStorageService.setLocalValue(LocalStorage.ACCESS_TOKEN, token);
        this.getUserDetails(userid);
      }
    });
  }

  getUserDetails(userId: string) {
    this.adminDashboardService.getUserDetails(userId)
      .subscribe(
        data => {
          LocalStorageService.setLocalValue(LocalStorage.FROM_ADMIN, true);
          this.registrationService.onSuccess(data);
        }, error => { this.registrationService.loginFail(error)}
      );
  }
}
