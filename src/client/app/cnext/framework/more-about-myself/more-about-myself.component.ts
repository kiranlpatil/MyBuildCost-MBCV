import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {MessageService} from "../../../framework/shared/message.service";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Message} from "../../../framework/shared/message";
import {Candidate, Section} from "../model/candidate";
import {Messages, Tooltip} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-more-about-myself',
  templateUrl: 'more-about-myself.component.html',
  styleUrls: ['more-about-myself.component.css']
})

export class MoreAboutMyselfComponent implements OnInit {
  @Input() candidate: Candidate;
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();
  private maxLength: number = 250;
  private reSize: string[];
  private spaceSplitedString: string[];
  private dotSplitedString: string[];
  private commaSplitedString: string[];
  private wordsTillNow: number;
  private remainingWords: number;
  private maxword: number;
  private showButton: boolean = true;
  tooltipMessage: string = '<ul><li><p>1. '+ Tooltip.MORE_ABOUT_MYSELF_TOOLTIP+'</p></li></ul>';
  private remainingWordsMessage = Messages.MSG_ERROR_VALIDATION_MAX_WORD_ALLOWED;

  constructor(private messageService: MessageService,
              private profileCreatorService: CandidateProfileService) {
    this.reSize = new Array(1);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (this.candidate.aboutMyself !== undefined) {
      this.spaceSplitedString = this.candidate.aboutMyself.split(' ');
      this.dotSplitedString = this.candidate.aboutMyself.split('.');
      this.commaSplitedString = this.candidate.aboutMyself.split(',');
      this.wordsTillNow = this.spaceSplitedString.length + this.dotSplitedString.length + this.commaSplitedString.length;
      this.remainingWords = this.maxLength - (this.wordsTillNow - 3);
    }
    if (this.candidate.aboutMyself == undefined) {
      this.candidate.aboutMyself = '';
    }
  }

  OnCandidateDataSuccess(candidateData: any) {
  }

  onError(error: any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  addAboutMyself() {
    this.spaceSplitedString = this.candidate.aboutMyself.split(' ');
    this.dotSplitedString = this.candidate.aboutMyself.split('.');
    this.commaSplitedString = this.candidate.aboutMyself.split(',');
    this.wordsTillNow = this.spaceSplitedString.length + this.dotSplitedString.length + this.commaSplitedString.length;
    this.remainingWords = this.maxLength - (this.wordsTillNow - 3);
    if (this.wordsTillNow - 3 >= this.maxLength) {
      this.maxword = this.candidate.aboutMyself.length;
    }
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        this.highlightedSection.isDisable = false;

      },
      error => {
        console.log(error);
      });
    this.onComplete.emit(this.candidate.aboutMyself);
  }
  onNext() {
    this.highlightedSection.name='EmploymentHistory';
    this.highlightedSection.isDisable=false;
    this.onComplete.emit(this.candidate.aboutMyself);
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onSave() {
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onPrevious() {
    this.highlightedSection.name = 'Professional-Details';
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onEdit() {
    this.highlightedSection.name = 'AboutMySelf';
    this.highlightedSection.isDisable = true;
    this.showButton = false;
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }
}
