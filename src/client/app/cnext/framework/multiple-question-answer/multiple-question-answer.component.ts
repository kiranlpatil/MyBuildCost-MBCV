import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
import { ComplexityDetails } from "../../../user/models/complexity-detail";
import { LocalStorage, Tooltip } from "../../../shared/constants";
import { LocalStorageService } from "../../../shared/services/localstorage.service";
import { Scenario } from "../../../user/models/scenario";
import { Capability } from "../../../user/models/capability";

@Component({
  moduleId: module.id,
  selector: 'cn-multiple-question-answer',
  templateUrl: 'multiple-question-answer.component.html',
  styleUrls: ['multiple-question-answer.component.css']
})

export class MultipleQuestionAnswerComponent implements OnInit, OnChanges {

  @Input() capabilityDetails: Capability = new Capability();
  @Input() slideQuestionToRight: boolean;
  @Input() slideQuestionToLeft: boolean;
  @Output() onComplete = new EventEmitter();
  @Output() onQuestionComplete = new EventEmitter();
  @Output() onMustHaveSelect = new EventEmitter();
  private isCandidate: boolean = false;
  private counter: number;

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
  }

  ngOnChanges(changes: any) {
    if (changes.capabilityDetails && changes.capabilityDetails.currentValue) {
      setTimeout(() => {
        this.capabilityDetails = changes.capabilityDetails.currentValue;
      }, 1002);
      this.counter = 0;
    }
  }

  onQuestionSelect(complexityDetails: ComplexityDetails, scenario: Scenario, event: any) {
    /*let code:any[] =scenario.code.split('.');*/
    complexityDetails.userChoice = scenario.code;
    for (let i = 0; i < this.capabilityDetails.complexities.length; i++) {
      if (this.capabilityDetails.complexities[i].name === complexityDetails.complexity_name) {
        this.capabilityDetails.complexities[i].complexityDetails = complexityDetails;
        break;
      }
    }
    this.onQuestionComplete.emit(complexityDetails);
    this.counter++;
    if (this.counter === this.capabilityDetails.complexities.length) {
      this.onAnsweringComplete();
    }
  }

  onAnsweringComplete() {
    this.onComplete.emit(this.capabilityDetails);
  }

  onSelectMustHaveComplexities(complexityDetails: ComplexityDetails, event:any) {
    for (let i = 0; i < this.capabilityDetails.complexities.length; i++) {
      if (this.capabilityDetails.complexities[i].name === complexityDetails.complexity_name) {
        this.capabilityDetails.complexities[i].complexityDetails = complexityDetails;
        break;
      }
    }
    complexityDetails.complexityIsMustHave = event.toElement.checked;
    this.onMustHaveSelect.emit(complexityDetails);
  }

  getTooltip() {
    return Tooltip;
  }

}
