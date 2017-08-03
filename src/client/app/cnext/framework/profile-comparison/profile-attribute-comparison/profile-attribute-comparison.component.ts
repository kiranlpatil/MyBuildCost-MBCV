import {Component, Input, OnInit} from "@angular/core";
import {ProfileComparisonData, CompareEntityDetails} from "../../model/profile-comparison";
declare let $: any;

@Component({
  moduleId:module.id,
  selector:'cn-profile-attribute-comparison',
  templateUrl:'profile-attribute-comparison.component.html',
  styleUrls: ['profile-attribute-comparison.component.css']

})

export class ProfileAttributeComparisonComponent implements OnInit {
  @Input() profileComparisonResult: ProfileComparisonData[];
  @Input() profileComparisonJobData:CompareEntityDetails;
 constructor() {}

    ngOnInit() {
        $('.compare-candidate-container').scroll(function () {
            $(this).find('.matching-attribute-name').css('left', $(this).scrollLeft());
        });
    }
}
