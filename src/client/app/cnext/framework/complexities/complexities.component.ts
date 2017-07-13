import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {Role} from '../model/role';
import {ComplexityService} from '../complexity.service';
import {LocalStorageService} from '../../../framework/shared/localstorage.service';
import {LocalStorage} from '../../../framework/shared/constants';
import {Section} from '../model/candidate';
import {ComplexityDetails} from '../model/complexity-detail';
import {ComplexityComponentService} from './complexity.service';
import {JobCompareService} from '../single-page-compare-view/job-compare-view/job-compare-view.service';
import {Capability} from '../model/capability';

@Component({
  moduleId: module.id,
  selector: 'cn-complexities',
  templateUrl: 'complexities.component.html',
  styleUrls: ['complexities.component.css']
})

export class ComplexitiesComponent implements OnInit, OnChanges {
  @Input() roles: Role[] = new Array(0); //TODO remove this
  @Input() complexities: any; //TODO why this is of type of ANY
  @Output() onComplete = new EventEmitter();
  @Output() onComplextyAnswered = new EventEmitter();
  @Input() highlightedSection: Section;
  @Input() isComplexityPresent: boolean = true;

  private complexityIds: string[] = [];
  private complexityList: any[] = new Array(0);
  private currentComplexityDetails: ComplexityDetails = new ComplexityDetails();
  private isComplexityButtonEnable: boolean = false;
  private showModalStyle: boolean = false;
  private isCandidate: boolean = false;
  private currentComplexity: number;
  private showMore: boolean = false;
  private slideToRight: boolean = false;
  private slideToLeft: boolean = false;
  private capabilities: Capability[] = [];
  private complexityData: any;

  tooltipCandidateMessage: string = "<ul><li>" +
    "<h5>Complexities</h5><p class='info'> This section provides a list of complexity scenarios for your selected capabilities." +
    "If more than one options are applicable to you, choose the option with a higher level of expertise.</p></li>" +
    "<li><p>If a scenario was applicable to you in past but is no more relevant to you, avoid choosing such scenarios.</p>" +
    "</li></ul>";
  tooltipRecruiterMessage: string = '<ul><li>' +
    '<h5>Complexities</h5><p class="info"> This section provides a list of complexity scenarios for selected capabilities.' +
    'For each scenario, select the most appropriate level that candidate is required to handle.</p></li>' +
    '<li><p>For scenarios that are not relevant to your job profile, choose "not applicable".</p>' +
    '</li></ul>';
  @ViewChild("save")
  private _inputElement1: ElementRef;

  constructor(private complexityService: ComplexityService,
              private complexityComponentService: ComplexityComponentService,
              private jobCompareService: JobCompareService) {
  }

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
  }

  ngOnChanges(changes: any) {
    if (changes.roles && changes.roles.currentValue) {
      this.roles = changes.roles.currentValue;
    }
    if (changes.complexities && changes.complexities.currentValue) {
      this.complexities = changes.complexities.currentValue;
      let jobId : string;
      if(!this.isCandidate) {
        jobId=LocalStorageService.getLocalValue(LocalStorage.POSTED_JOB);
      }
      this.complexityComponentService.getCapabilityMatrix(jobId).subscribe(
        capa => {
          this.complexityData = capa.data;
          this.getComplexityIds(this.complexities);
          this.capabilities = this.jobCompareService.getStandardMatrix(capa.data);
        });

    }
  }

  getCurrentComplexityPosition() {
   for (let i = 0; i < this.complexityIds.length; i++) {
   if(this.complexityList[i].userChoice===undefined || this.complexityList[i].userChoice === ''){
     return i;
   }
   }
    return 0;
  }
  getComplexityIds(complexities: any) {
    this.currentComplexity = 0;
    this.complexityIds = [];
    this.complexityIds = Object.keys(complexities);
    this.complexityList = [];
    for (let id in complexities) {
      this.complexityList.push(this.complexityData[id]);
    }
    this.currentComplexity = this.getCurrentComplexityPosition();
    this.getComplexityDetails(this.complexityIds[this.currentComplexity]);
  }

  saveComplexity() {
    let jobId : string;
    if(!this.isCandidate) {
      jobId=LocalStorageService.getLocalValue(LocalStorage.POSTED_JOB);
    }
    this.complexityComponentService.getCapabilityMatrix(jobId).subscribe(
      capa => {
        this.capabilities = this.jobCompareService.getStandardMatrix(capa.data);
      });
    this.isComplexityButtonEnable = false;
    if (this.isCandidate) {
      this.showModalStyle = !this.showModalStyle;
      this.highlightedSection.isLocked = true;
    }
    this.complexityService.change(true);
    if (this.highlightedSection.isProficiencyFilled) {
      this.highlightedSection.name = 'none';
    } else {
      this.highlightedSection.name = 'Proficiencies';
    }
    this.highlightedSection.isDisable = false;
    this.onComplete.emit();
  }

  onAnswered(complexityDetail: ComplexityDetails) {
    this.complexities[this.complexityIds[this.currentComplexity]] = complexityDetail.userChoice;
    this.complexityData[this.complexityIds[this.currentComplexity]] = complexityDetail;
    this.onNext();
  }

  onNext() {
    this.onComplextyAnswered.emit(this.complexities);
    if (this.slideToLeft === true) {
      this.slideToLeft = !this.slideToLeft;
    }
    this.slideToRight = !this.slideToRight;
    if (this.currentComplexity === this.complexityIds.length - 1) {
      if (this.isCandidate) {
        this.showHideModal();
      } else {
        this.saveComplexity();
      }
    } else if (this.currentComplexity <= this.complexityIds.length - 1) {
      setTimeout(() => {
        this.getComplexityDetails(this.complexityIds[++this.currentComplexity]);
      }, 1002);
    }
    setTimeout(() => {
      this.slideToRight = false;
    }, 3000);
  }

  onPrevious() {
    if (this.currentComplexity >= 0) {
      this.getComplexityDetails(this.complexityIds[--this.currentComplexity]);
    }
    if (this.slideToRight === true) {
      this.slideToRight = !this.slideToRight;
    }
    this.slideToLeft = !this.slideToLeft;
    setTimeout(() => {
      this.slideToLeft = false;
    }, 3000);
  }

  getComplexityDetails(complexityId: string) {  //TODO remove after amits call of updated get API
    if (this.complexityData !== undefined) {
      this.currentComplexityDetails = this.complexityData[complexityId];
    }
  }

  getStyleModal() {
    if (this.showModalStyle) {
      this._inputElement1.nativeElement.focus();
      return 'block';
    } else {
      this._inputElement1.nativeElement.focus();
      return 'none';
    }
  }

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }

  edit() {
    this.highlightedSection.name = 'Complexities';
    this.highlightedSection.isDisable = true;
    this.showMore = false;
  }
}
