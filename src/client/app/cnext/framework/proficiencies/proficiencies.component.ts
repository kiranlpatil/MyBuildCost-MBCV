import {Component, Input, EventEmitter, Output} from "@angular/core";
import {Section} from "../model/candidate";
import {ValueConstant} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-proficiencies',
  templateUrl: 'proficiencies.component.html',
  styleUrls: ['proficiencies.component.css']
})

export class ProficienciesComponent {
  @Input() choosedproficiencies:string[];
  @Input() highlightedSection:Section;
  @Input() proficiencies:string[];
  @Output() onComplete = new EventEmitter();
  @Output() onSelect = new EventEmitter();
  private maxProficiencies:number;
  tooltipMessage : string="<p class='info'>Enter all key words that describe your area of expertise or specialization.Ensure that you cover all relevant aspects of Technologies, Products, Methodologies, Models, Processes, Tools, Domain expertise and any additional key words that describe your work. These keywords will help the recruiter identify your specialties / proficiencies. Selecting too many proficiencies would dilute the matching and alignment with the best job opportunity. Hence you should select maximum 25 proficiencies.</p>";

  ngOnInit(){
    this.maxProficiencies=ValueConstant.MAX_PROFECIENCES;
  }

  private showButton:boolean = true;

  
  onProficiencyComplete(proficiency:string[]) {
    /*if (proficiency.length > 0) {
      this.disablebutton = false;
    } else {
      this.disablebutton = true;
    }*/
    this.onSelect.emit(proficiency);
  }

  onNext() {
      this.onComplete.emit();
    this.highlightedSection.name = "IndustryExposure";
    this.highlightedSection.isDisable=false;
  }
  onSave() {
    this.highlightedSection.name="none";
    this.highlightedSection.isDisable=false;
      this.onComplete.emit();

  }
}

















































































