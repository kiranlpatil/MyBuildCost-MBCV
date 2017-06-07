import {  Component, OnInit, OnDestroy  } from '@angular/core';
import {  LoaderService  } from '../../shared/loader/loader.service';

@Component({
    moduleId: module.id,
    selector: 'tpl-dashboard-home',
    templateUrl: 'dashboard-home.component.html',
    styleUrls: ['dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit,OnDestroy {

      constructor(private loaderService:LoaderService) {

    }

    ngOnInit() {
        document.body.scrollTop = 0;
    }

    ngOnDestroy() {
     // this.loaderService.stop();
    }
}
