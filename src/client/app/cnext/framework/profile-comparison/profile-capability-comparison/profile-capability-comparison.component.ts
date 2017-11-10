import {Component, Input, OnChanges, OnInit} from "@angular/core";
import {ProfileComparisonData} from "../../model/profile-comparison";
declare let $: any;

@Component({
  moduleId:module.id,
  selector:'cn-profile-capability-comparison',
  templateUrl:'profile-capability-comparison.component.html',
    styleUrls: ['profile-capability-comparison.component.css']

})

export class ProfileCapabilityComparisonComponent implements OnChanges, OnInit {

  @Input() profileComparisonResult: ProfileComparisonData[];
  constructor() {}

  ngOnChanges(changes: any) {
  }

  ngOnInit() {
    $('.compare-candidate-container').scroll(function () {
      $(this).find('.matching-capability-headings').css('left', $(this).scrollLeft());
    });
  }

}
