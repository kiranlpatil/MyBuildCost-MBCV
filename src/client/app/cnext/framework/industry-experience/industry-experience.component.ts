import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Industry} from "../model/industry";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Section} from "../model/candidate";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-industry-experience',
  templateUrl: 'industry-experience.component.html',
  styleUrls: ['industry-experience.component.css']
})

export class IndustryExperienceListComponent {

  private industries:Industry[] = new Array(0);
  private selectedIndustries:string[] = new Array(0);
  @Input() highlightedSection :Section;
  @Input() candidateExperiencedIndustry:string[] = new Array(0);
  @Output() onComplete = new EventEmitter();

  constructor(private candidateProfileService:CandidateProfileService) {
    this.candidateProfileService.getIndustries()
      .subscribe(industries => this.industries = industries.data);
        this.candidateExperiencedIndustry=new Array(0);
  }

  ngOnChanges(changes:any){
    if(changes.candidateExperiencedIndustry.currentValue != undefined){
      this.candidateExperiencedIndustry=changes.candidateExperiencedIndustry.currentValue;
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
    this.onComplete.emit(this.selectedIndustries);
  }

  onNext() {
    if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==='true') {
      this.highlightedSection.name = "Professional-Details";
    }
    else{
      this.highlightedSection.name = "Compentancies";
    }
  }
}


