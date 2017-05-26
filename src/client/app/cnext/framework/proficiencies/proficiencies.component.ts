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

















































































