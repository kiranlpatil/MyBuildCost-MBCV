import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Industry} from "../model/industry";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Section} from "../model/candidate";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage, ValueConstant} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-industry-experience',
  templateUrl: 'industry-experience.component.html',
  styleUrls: ['industry-experience.component.css']
})

export class IndustryExperienceListComponent {
  private showButton:boolean = true;
  private industries:Industry[] = new Array(0);
  private selectedIndustries:string[] = new Array(0);
  @Input() highlightedSection :Section;
  @Input() choosedIndeustry :string;
  @Input() candidateExperiencedIndustry:string[] = new Array(0);
  @Output() onComplete = new EventEmitter();
  @Output() onNextComplete = new EventEmitter();
  private disableButton:boolean=true;
  tooltipMessage : string="<p class='info'>An individual may be exposed to multiple industries during the professional life. At times, organisations need individuals who have cross industry expertise. Select such industries where you can claim a reasonable exposure.</p>";

  constructor(private candidateProfileService:CandidateProfileService) {
    this.getIndustries();
        this.candidateExperiencedIndustry=new Array(0);
  }

  ngOnChanges(changes:any){

    if(changes.candidateExperiencedIndustry != undefined && changes.candidateExperiencedIndustry.currentValue != undefined){
      this.candidateExperiencedIndustry=changes.candidateExperiencedIndustry.currentValue;
      this.selectedIndustries=this.candidateExperiencedIndustry;
      if(this.selectedIndustries.length>0){
        this.disableButton=false;
      }
    }

    if(changes.choosedIndeustry != undefined && changes.choosedIndeustry.currentValue != undefined){
      this.choosedIndeustry=changes.choosedIndeustry.currentValue;
      this.getIndustries();
    }
    if(this.candidateExperiencedIndustry === undefined){
      this.candidateExperiencedIndustry= new Array(0);
    }
  }

  selectIndustryModel(industry:string,event:any) {
    if(event.target.checked) {
      this.disableButton=false;
      if(this.selectedIndustries.length<ValueConstant.MAX_INTERESTEDINDUSTRY){
        this.selectedIndustries.push(industry);
      } else {
        event.target.checked = false;
      }
    } else {
      for (let data of this.selectedIndustries) {
        if (data === industry) {
          this.selectedIndustries.splice(this.selectedIndustries.indexOf(data), 1);
        }
      }
    }
    if(this.selectedIndustries.length <= 0){
      this.disableButton=true;
    }
    this.onComplete.emit(this.selectedIndustries);
  }

  onNext() {

    if(LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE)==='true') {
      this.highlightedSection.name = "Professional-Details";
      this.highlightedSection.isDisable=false;
      this.onNextComplete.emit()
    }
    else{
      this.onNextComplete.emit();
      this.highlightedSection.name = "Compentancies";
      this.highlightedSection.isDisable=false;

    }
  }
  onSave() {
      this.highlightedSection.name = "none";
      this.highlightedSection.isDisable=false;
  }
  
  getIndustries(){
    this.candidateProfileService.getIndustries()
      .subscribe(industries => this.onIndustryListSuccess(industries.data));
  }
  
  onIndustryListSuccess(data:Industry[]){
    this.industries = data;
    for (let item of this.industries){
      if(item.name===this.choosedIndeustry){
        this.industries.splice(this.industries.indexOf(item), 1);
      }
    }
    var newIndustry=new Industry();
    newIndustry.name="any";
    this.industries.push(newIndustry);
  }
}


