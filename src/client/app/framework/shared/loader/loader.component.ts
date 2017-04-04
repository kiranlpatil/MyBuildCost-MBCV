import {   Component  } from '@angular/core';
import {  LoaderService  } from './loader.service';

@Component({
    selector: 'app-loader',
  template: `<div *ngIf='status' class='loader-container'> <div class='inner-loader'></div> </div>`
})
export class LoaderComponent {

    private status: boolean;

    public constructor(private loaderService: LoaderService) {
        loaderService.status.subscribe((status: boolean) => {
            this.status = status;
        });
    }

}
