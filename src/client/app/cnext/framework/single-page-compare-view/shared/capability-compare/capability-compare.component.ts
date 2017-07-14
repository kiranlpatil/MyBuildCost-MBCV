import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { Role } from '../../../model/role';
import {Capability} from "../../../model/capability";
import {Scenario} from "../../../model/scenario";
import {AppSettings, LocalStorage} from "../../../../../framework/shared/constants";
import {LocalStorageService} from "../../../../../framework/shared/localstorage.service";

@Component({
  moduleId: module.id,
  selector: 'cn-capability-compare',
  templateUrl: 'capability-compare.component.html',
  styleUrls: ['capability-compare.component.css']
})

export class CapabilityCompareComponent  implements OnChanges{

  @Input() capabilities: Capability[] = new Array(0);
  @Input() rowsToShow: number;
  @Input() isCompact : boolean = false;
  @Input() candidate_picture : string;
  @Input() job_picture : string;
  isCandidate: boolean;
  maxArray : number[]= new Array(0);
  ngOnChanges(changes : any) {
    if(changes.capabilities && changes.capabilities.currentValue) {
      let max = 0;
      for(let cap of changes.capabilities.currentValue) {
        if(max < cap.complexities.length){
          max=cap.complexities.length;
        }
        for(let com of cap.complexities){
          let sces : Scenario[]= com.scenarios.filter((sce:Scenario)=>{
            if(sce.name != undefined && sce.name != 'Not Applicable'){
                return true;
            }else {
              return false;
            }
          });
          if(sces && sces.length>0) {
            cap.isFound =true;
          }
        }
      }
      this.capabilities = changes.capabilities.currentValue;


      this.maxArray = new Array(max);
      if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
        this.isCandidate = true;
      }else {
        this.isCandidate = false;
      }
    }
    //  console.log("in compare view",this.roles);
  }
  getImagePath(imagePath: string) {
    if (imagePath !== undefined) {
      return AppSettings.IP + imagePath.substring(4).replace('"', '');
    }
    return null;
  }


}
