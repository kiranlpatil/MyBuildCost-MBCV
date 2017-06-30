import { Component, EventEmitter, Input, Output,OnInit,OnChanges } from '@angular/core';
import { ComplexityDetails } from '../model/complexity-detail';
import { LocalStorage } from '../../../framework/shared/constants';
import { LocalStorageService } from '../../../framework/shared/localstorage.service';
import { Scenario } from '../model/scenario';

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
    this.complexityDetails = changes.complexityDetails.currentValue;
  }
}

onQuestionSelect(scenario:Scenario,event:any) {
let code:any[] =scenario.code.split('.');
  this.complexityDetails.userChoice=code[2];
  this.onComplete.emit(this.complexityDetails);
}

isChecked(code:string) {
  let splitCode:string[]=this.complexityDetails.code.split('_');
    let usercode:string =splitCode[0]+'.'+splitCode[1]+'.'+this.complexityDetails.userChoice;
    if(code===usercode) {
      return true;
    } else {
      return false;
    }
}
}
