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
  keySkillSorting:any[] = new Array(0);
 constructor() {}
  
  ngOnInit() {
        $('.compare-candidate-container').scroll(function () {
            $(this).find('.matching-attribute-name').css('left', $(this).scrollLeft());
        });
    }

  sortKeySkills(profileComparisonResult:ProfileComparisonData[]) {
    this.keySkillSorting = new Array(0);
    for (let item of profileComparisonResult) {
     var objArray:any[] = new Array();
         for(let match of item.proficienciesMatch){
           var obj = {'value':match,'status':'match'}
           this.keySkillSorting.push(obj);
         }
         for(let match of item.proficienciesUnMatch){
           var obj = {'value':match,'status':'unmatch'}
           this.keySkillSorting.push(obj);
         }
    }
  }
}
