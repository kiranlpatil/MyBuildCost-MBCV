import {Component, Input, OnInit, Output} from "@angular/core";
import {EventEmitter} from "@angular/common/src/facade/async";
import {ProfileComparisonData} from "../../model/profile-comparison";
declare let $: any;
@Component({
  moduleId:module.id,
  selector:'cn-profile-comparison-header',
  templateUrl:'profile-comparison-header.component.html',
  styleUrls: ['profile-comparison-header.component.css']
})

export class ProfileComparisonHeaderComponent implements OnInit {

  @Input() profileComparisonResult: ProfileComparisonData[];
  @Output() actionOnComparisonList = new EventEmitter();

  constructor() {
  }

    ngOnInit() {
        $('.compare-candidate-container').scroll(function () {
            $(this).find('.matching-capabilities').css('left', $(this).scrollLeft());
        });
    }

  actionToPerformOnCompareList(action: string, value: any) {
    var data = {'action': action, 'value': value};
    this.actionOnComparisonList.emit(data);
   }
}
