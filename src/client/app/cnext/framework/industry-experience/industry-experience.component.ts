import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Industry} from "../model/industry";

@Component({
  moduleId: module.id,
  selector: 'cn-industry-experience-list',
  templateUrl: 'industry-experience.component.html',
  styleUrls: ['industry-experience.component.css']
})

export class IndustryExperienceListComponent {

  @Input() industries:Industry[] = new Array(0);
  private selectedIndustries:string[] = new Array(0);
  @Input() candidateExperiencedIndustry:string[] = new Array(0);
  @Output() selectExperiencedIndustry = new EventEmitter();

  ngOnChanges(changes:any) {debugger
    if (changes.industries != undefined) {
      if (changes.industries.currentValue != undefined)
        this.industries = changes.industries.currentValue;
    }
  }

  selectIndustryModel(industry:string,event:any) {
    if(event.target.checked) {
      this.selectedIndustries.push(industry);
    } else {
      for (let data of this.selectedIndustries) {
        if (data === industry) {
          this.selectedIndustries.splice(this.selectedIndustries.indexOf(data), 1);
        }
      }
    }
    this.selectExperiencedIndustry.emit(this.selectedIndustries);
  }
}


