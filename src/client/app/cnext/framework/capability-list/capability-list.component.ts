
import {Response, Http} from '@angular/http';
import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Rx';
import {VALUE_CONSTANT} from "../../../framework/shared/constants";
import {TestService} from "../test.service";
import {ComplexityService} from "../complexity.service";



@Component({
  moduleId: module.id,
  selector: 'cn-capibility-list',
  templateUrl: 'capability-list.component.html',
  styleUrls: ['capability-list.component.css']
})

export class CapabilityListComponent {
  private capabilities: string[];
  private selectedCapabilities =new Array();
  private showAlert: boolean=false;
  private isShowCapability :boolean=false;
  constructor(private _router:Router, private http:Http,
              private activatedRoute:ActivatedRoute,
              private testService : TestService,
              private complexityService : ComplexityService) {
    testService.showTest$.subscribe(
      data=>{
        this.isShowCapability=true;
      }
    );
    this.http.get("capability")
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.capabilities = data.capability;
        },
        err => console.error(err),
        () => console.log()
      );

  }


  selectOption(newVal:any){
    if(!newVal.target.checked){
      this.showAlert=false;
      for (let i = 0; i < this.selectedCapabilities.length; i++) {
        if (this.selectedCapabilities[i] === newVal.target.value) {
          if (i > -1) {
            this.selectedCapabilities.splice(i, 1);
            console.log("removed");
          }
        }
      }
    }




if(this.selectedCapabilities.length < VALUE_CONSTANT.MAX_CAPABILITIES) {
  if (newVal.target.checked) {
    this.showAlert=false;
    this.selectedCapabilities.push(newVal.target.value);
    console.log("added")
  }
  else {
    for (let i = 0; i < this.selectedCapabilities.length; i++) {
      if (this.selectedCapabilities[i] === newVal.target.value) {
        if (i > -1) {
          this.selectedCapabilities.splice(i, 1);
          console.log("removed");
        }
      }
    }
  }
}
    else{
  this.showAlert=true;
  newVal.target.checked=false;
}
    if(this.selectedCapabilities.length>1){
        this.complexityService.change(true);
    }

    console.log(this.selectedCapabilities);

    /*if(this.selectedCapabilities.length<=10)
    this.selectedCapabilities.push(newVal.currentTarget.innerText);*/
  }
  /*navigateTo(navigateTo: string, fileName: string, filepath : string) {
    if (navigateTo !== undefined && fileName !== undefined) {
      this._router.navigate([navigateTo + '/' + fileName]);
    }
    LocalStorageService.setLocalValue(QELocalStorage.FILE_PATH, filepath);
  }*/




}
