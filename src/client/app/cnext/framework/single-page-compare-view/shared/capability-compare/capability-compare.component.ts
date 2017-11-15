import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {Capability} from "../../../../../user/models/capability";
import {Scenario} from "../../../../../user/models/scenario";
import {AppSettings, LocalStorage, Tooltip} from "../../../../../shared/constants";
import {LocalStorageService} from "../../../../../shared/services/localstorage.service";
import {Complexity} from "../../../../../user/models/complexity";

@Component({
  moduleId: module.id,
  selector: 'cn-capability-compare',
  templateUrl: 'capability-compare.component.html',
  styleUrls: ['capability-compare.component.css']
})

export class CapabilityCompareComponent  implements OnChanges {

  @Input() capabilities: Capability[] = new Array(0);
  @Input() rowsToShow: number;
  @Input() isCompact : boolean = false;
  @Input() candidate_picture : string;
  @Output() SelectedComplexity = new EventEmitter();
  @Input() job_picture : string;
  isCandidate: boolean;
  showMore: boolean = false;
  showMoreUnable: boolean = false;
  private capabilityCompareAboveMatch= Tooltip.CAPABILITY_COMPARE_ABOVE_MATCH;
  private capabilityCompareBelowMatch= Tooltip.CAPABILITY_COMPARE_BELOW_MATCH;
  private capabilityCompareExactMatch= Tooltip.CAPABILITY_COMPARE_EXACT_MATCH;
  private capabilityCompareMissing= Tooltip.CAPABILITY_COMPARE_MISSING_MATCH;
  maxArray : number[]= new Array(0);
  ngOnChanges(changes : any) {
    if(changes.capabilities && changes.capabilities.currentValue) {

      //Removed complexities with 'Not Applicable or NA'
      if (!this.isCompact) {
        for (let cap of changes.capabilities.currentValue) {
          for (var i = cap.complexities.length - 1; i >= 0; i--) {
            var com = cap.complexities[i];
            if (com.scenarios[0].job_scenario_name == undefined || com.scenarios[0].job_scenario_name == 'Not Applicable') {
              cap.complexities.splice(i, 1);
            }
          }
        }
      }

      let max = 0;
      for(let cap of changes.capabilities.currentValue) {
        if(max < cap.complexities.length){
          max=cap.complexities.length;
        }
        for(let com of cap.complexities){
          let sces : Scenario[]= com.scenarios.filter((sce:Scenario)=>{
            if(sce.name !== undefined && sce.name !== 'Not Applicable') {
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

    if(changes.rowsToShow && changes.rowsToShow.currentValue) {
      this.rowsToShow = changes.rowsToShow.currentValue;
    }

    if (this.capabilities != undefined) {
      if (this.capabilities.length > this.rowsToShow) {
        this.showMoreUnable = true;
      }
    }

  }

  onComplexitySelect(complexity:Complexity,capability:Capability) {
    window.scrollTo(0, 0);
    if(this.isCandidate) {
    this.SelectedComplexity.emit(complexity);
    } else {
      this.SelectedComplexity.emit(capability);
    }
  }

  getImagePath(imagePath: string) {
    if (imagePath !== undefined) {
      return AppSettings.IP + imagePath.replace('"', '');
    }
    return null;
  }

  isShowMore() {
    this.showMore = true;
  }

  isShowLess() {
    this.showMore = false;
  }

    getTooltip() {
    return Tooltip;
  }

}
