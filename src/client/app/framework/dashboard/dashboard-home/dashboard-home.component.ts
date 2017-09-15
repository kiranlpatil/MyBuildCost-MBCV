import {Component, OnDestroy, OnInit} from "@angular/core";
import {LoaderService} from "../../../shared/loader/loaders.service";

@Component({
  moduleId: module.id,
  selector: 'cn-dashboard-home',
  templateUrl: 'dashboard-home.component.html',
  styleUrls: ['dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {

  constructor(private loaderService: LoaderService) {

  }

  ngOnInit() {
    document.body.scrollTop = 0;
  }

  ngOnDestroy() {
    // this.loaderService.stop();
  }
}
