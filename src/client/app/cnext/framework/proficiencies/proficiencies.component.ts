import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Section} from "../model/candidate";
import {ValueConstant} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-proficiencies',
  templateUrl: 'proficiencies.component.html',
  styleUrls: ['proficiencies.component.css']
})

export class ProficienciesComponent {
  @Input() choosedproficiencies: string[];
  @Input() highlightedSection: Section;
  @Input() proficiencies: string[];
  @Output() onComplete = new EventEmitter();
  @Output() onSelect = new EventEmitter();
  tooltipMessage: string = "<ul><li><h5>Key Skills</h5><p class='info'>" +
      "Enter all key words that describe your area of expertise or specialization.</p></li>" +
    "<li><p class='info'>Ensure that you cover all relevant aspects of Technologies, Products, Methodologies, Models, " +
      "Processes, Tools, Domain expertise and any additional key words that describe your work. " +
      "These keywords will help the recruiter identify your specialties / proficiencies</p></li>" +
    "<li><p class='info'>Selecting too many Key Skills would dilute the matching and alignment with the " +
      "best job opportunity. Hence you should select maximum 25 Key Skills.</p></li></ul>";
  private maxProficiencies: number;
  ngOnInit() {
    this.maxProficiencies = ValueConstant.MAX_PROFECIENCES;
  }

  private showButton: boolean = true;
  private submitStatus: boolean;

  onProficiencyComplete(proficiency: string[]) {
    /*if (proficiency.length > 0) {
     this.disablebutton = false;
     } else {
     this.disablebutton = true;
     }*/
    this.submitStatus = false;
    this.onSelect.emit(proficiency);
  }

  onNext() {
    if(this.choosedproficiencies.length == 0){
      this.submitStatus = true;
      return
    }
    this.onComplete.emit();
    this.highlightedSection.name = 'IndustryExposure';
    this.highlightedSection.isDisable = false;
  }

  onSave() {
    if(this.choosedproficiencies.length == 0){
      this.submitStatus = true;
      return
    }
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.onComplete.emit();

  }
}
