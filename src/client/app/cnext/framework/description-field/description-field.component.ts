import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'cn-description-field',
  templateUrl: 'description-field.component.html',
  styleUrls: ['description-field.component.css']
})

export class DescriptionFieldComponent implements OnChanges {
  @Input('type') type: string;
  @Input('maxLength') maxLength: number;
  @Input() description: string;
  @Output() onComplete = new EventEmitter();

  private newstringOne: string[];
  private newstringTwo: string[];
  private newstringThree: string[];
  private condition: number;
  maxword: number;
  remainingWords: number;

  constructor() {
    this.remainingWords = this.maxLength;
  }


  ngOnChanges() {
    if (this.description != undefined && this.description !== '') {
      this.wordCount();
    }
  }

  wordCount() {
    this.newstringOne = this.description.split(' ');
    this.newstringTwo = this.description.split('.');
    this.newstringThree = this.description.split(',');
    this.condition = this.newstringOne.length + this.newstringTwo.length + this.newstringThree.length;
    this.remainingWords = this.maxLength - (this.condition - 3);
    if (this.condition - 3 >= this.maxLength) {
      this.maxword = this.description.length;
    }
    this.onComplete.emit(this.description);
  }
}
