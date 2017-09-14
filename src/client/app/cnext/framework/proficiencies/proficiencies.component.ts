import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Section} from "../model/candidate";
import {Messages, Tooltip, ValueConstant} from "../../../shared/constants";
import {ProficiencyDetailsService} from "../proficiency-detail-service";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {ErrorService} from "../error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-proficiencies',
  templateUrl: 'proficiencies.component.html',
  styleUrls: ['proficiencies.component.css']
})

export class ProficienciesComponent {
  @Input() choosedproficiencies: string[];
  @Input() highlightedSection: Section;
  private proficiencies: string[];
  @Output() onComplete = new EventEmitter();
  @Output() onSelect = new EventEmitter();
  tooltipMessage: string = '<ul><li><p>' +
      '1. '+ Tooltip.PROFICIENCIES_TOOLTIP_1+'</p></li>' +
    '<li><p>2. '+ Tooltip.PROFICIENCIES_TOOLTIP_2+'</p></li>' +
    '<li><p>3. '+Tooltip.PROFICIENCIES_TOOLTIP_3+'</p></li></ul>';
  private maxProficiencies: number;

  constructor(private proficiencyDetailService: ProficiencyDetailsService,
              private errorService:ErrorService,
              private profileCreatorService: CandidateProfileService) {
    this.proficiencyDetailService.makeCall$.subscribe(
      data => {
        if (data) {
          this.getProficiency();
        }
      }
    );
  }
  ngOnInit() {
    this.maxProficiencies = ValueConstant.MAX_PROFECIENCES;
  }
  private showButton: boolean = true;
  private submitStatus: boolean;
  private requiredKeySkillsValidationMessage = Messages.MSG_ERROR_VALIDATION_KEYSKILLS_REQUIRED;
  private maxKeySkillsValidationMessage = Messages.MSG_ERROR_VALIDATION_MAX_SKILLS_CROSSED + ValueConstant.MAX_PROFECIENCES + Messages.MSG_ERROR_VALIDATION_MAX_PROFICIENCIES;

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
    if (this.choosedproficiencies.length === 0) {
      this.submitStatus = true;
      return;
    }
    this.onComplete.emit();
    this.highlightedSection.name = 'IndustryExposure';
    this.highlightedSection.isDisable = false;

    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onSave() {
    if (this.choosedproficiencies.length === 0) {
      this.submitStatus = true;
      return;
    }
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.onComplete.emit();

      let _body: any = document.getElementsByTagName('BODY')[0];
      _body.scrollTop = -1;
  }

  getProficiency() {
    this.profileCreatorService.getProficiency()
      .subscribe(
        data => {
          this.proficiencies = data.data[0].proficiencies;
        },error => this.errorService.onError(error));
  }

    onPrevious() {
        this.highlightedSection.name = 'Complexities';
        let _body: any = document.getElementsByTagName('BODY')[0];
        _body.scrollTop = -1;
    }

    onEdit() {
        this.highlightedSection.name = 'Proficiencies';
        this.highlightedSection.isDisable = true;
        this.showButton = false;
        let _body: any = document.getElementsByTagName('BODY')[0];
        _body.scrollTop = -1;
    }
}
