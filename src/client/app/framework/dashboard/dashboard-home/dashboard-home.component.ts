import {Router} from "@angular/router";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {LoaderService} from "../../../shared/loader/loaders.service";
import { NavigationRoutes } from "../../../shared/index";
@Component({
  moduleId: module.id,
  selector: 'my-dashboard-home',
  templateUrl: 'dashboard-home.component.html',
  styleUrls: ['dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {

  constructor(private _router: Router, private loaderService: LoaderService) {

  }

  ngOnInit() {
    document.body.scrollTop = 0;
  }

  goToCreateProject() {
    this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
  }

  goToViewProject() {
    this._router.navigate([NavigationRoutes.APP_LIST_PROJECT]);
  }

  ngOnDestroy() {
    // this.loaderService.stop();
  }
}
