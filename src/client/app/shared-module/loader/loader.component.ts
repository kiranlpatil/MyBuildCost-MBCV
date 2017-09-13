import {Component} from "@angular/core";
import {LoaderService} from "./loaders.service";

@Component({
  selector: 'app-loader',
  template: `
    <div *ngIf='status' class='loader-container'>
      <img src="assets/c-next/loader/main-loading.svg" height="20" width="160" style="margin-top: 400px;"/>
    </div>`
})
export class LoaderComponent {

  private status: boolean;

  public constructor(private loaderService: LoaderService) {
    loaderService.status.subscribe((status: boolean) => {
      this.status = status;
    });

  }

}
