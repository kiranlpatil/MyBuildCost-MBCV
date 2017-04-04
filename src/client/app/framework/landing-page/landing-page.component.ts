import {  Component, OnInit, OnDestroy  } from '@angular/core';
import {  Router  } from '@angular/router';
import {  NavigationRoutes, ImagePath, LoaderService  } from '../shared/index';

@Component({
    moduleId: module.id,
    selector: 'landing-page',
    templateUrl: 'landing-page.component.html',
    styleUrls: ['landing-page.component.css'],
})
export class LandingPageComponent implements OnInit,OnDestroy {
    BODY_BACKGROUND:string;
    constructor(private loaderService:LoaderService,private _router:Router) {
        this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    }

    ngOnInit() {
        //this.loaderService.stop();
    }

    ngOnDestroy() {
        // this.loaderService.stop();
    }

}
