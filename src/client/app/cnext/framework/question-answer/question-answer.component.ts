import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import {ComplexityDetails} from "../../../user/models/complexity-detail";
import {LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {Scenario} from "../../../user/models/scenario";

@Component({
  moduleId: module.id,
  selector: 'cn-question-answer',
  templateUrl: 'question-answer.component.html',
  styleUrls: ['question-answer.component.css']
})

export class QuestionAnswerComponent implements OnInit,OnChanges {

  @Input() complexityDetails:ComplexityDetails = new ComplexityDetails();
  @Input() slideQuestionToRight:boolean;
  @Input() slideQuestionToLeft:boolean;
  @Output() onComplete = new EventEmitter();
  private isCandidate:boolean = false;

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
  }
 ngOnChanges(changes:any) {
  if (changes.complexityDetails && changes.complexityDetails.currentValue) {
    setTimeout(() => {
      this.complexityDetails = changes.complexityDetails.currentValue;
    }, 1002);
  }
}

onQuestionSelect(scenario:Scenario,event:any) {
let code:any[] =scenario.code.split('.');
  this.complexityDetails.userChoice = scenario.code;
  this.onComplete.emit(this.complexityDetails);
}

  onNoteChange() {
    if(this.complexityDetails.userChoice) {
      this.onComplete.emit(this.complexityDetails);
    }
  }

isChecked(code:string) {
  /*let splitCode:string[]=this.complexityDetails.code.split('_');
    let usercode:string =splitCode[0]+'.'+splitCode[1]+'.'+this.complexityDetails.userChoice;
   */
  if (code === this.complexityDetails.userChoice) {
      return true;
    } else {
      return false;
    }
}
}
