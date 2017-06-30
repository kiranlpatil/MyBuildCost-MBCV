import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from "@angular/core";
import {Role} from "../model/role";
import {ComplexityService} from "../complexity.service";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage} from "../../../framework/shared/constants";
import {Section} from "../model/candidate";
import {ComplexityDetails} from "../model/complexity-detail";

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
  private currentComplexityDetails:ComplexityDetails=new ComplexityDetails();
  private isComplexityButtonEnable: boolean = false;
  private showModalStyle: boolean = false;
  private isCandidate: boolean = false;
  private currentComplexity: number=0;
  private showMore: boolean = false;

  tooltipCandidateMessage: string = "<ul><li>" +
    "<h5>Complexities</h5><p class='info'> This section provides a list of complexity scenarios for your selected capabilities." +
    "For each scenario, select the most appropriate level of complexity that you are capable of handling.</p></li>" +
    "<li><p>If you have not handled a particular complexity, choose not applicable.</p>" +
    "</li></ul>";
  tooltipRecruiterMessage: string = '<ul><li>' +
    '<h5>Complexities</h5><p class="info"> This section provides a list of complexity scenarios for selected capabilities.' +
    'For each scenario, select the most appropriate level that candidate is required to handle.</p></li>' +
    '<li><p>For scenarios that are not relevant to your job profile, choose "not applicable".</p>' +
    '</li></ul>';
  @ViewChild("save")
  private _inputElement1: ElementRef;

  constructor(private complexityService: ComplexityService) {
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
      this.getComplexityIds(this.complexities);
    }
  }
  getComplexityIds(complexities: any) {
    this.complexityIds = [];
    for (let id in complexities) {
      this.complexityIds.push(id);
    }
    if(this.currentComplexity === 0) {
      this.getComplexityDetails(this.complexityIds[this.currentComplexity]);
    }
  }

  saveComplexity() {
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
    //this.currentComplexityDetails.isChecked=false;
    this.complexities[this.complexityIds[this.currentComplexity]] = complexityDetail.userChoice;
    console.log(this.complexities);
    this.onNext();
  }

  onNext() {
    this.onComplextyAnswered.emit(this.complexities);
    if (this.currentComplexity < this.complexityIds.length - 1) {
      this.getComplexityDetails(this.complexityIds[++this.currentComplexity]);
    }
    if (this.currentComplexity === this.complexityIds.length - 1) {
      this.showHideModal();
    }
  }
  onPrevious() {
    if(this.currentComplexity>=0) {
      this.getComplexityDetails(this.complexityIds[--this.currentComplexity]);
    }
  }

  getComplexityDetails(complexityId: string) {  //TODO remove after amits call of updated get API
    if(complexityId !== undefined && complexityId !== ''){
      let splitedString:string[]=complexityId.split('_');
      for(let role of this.roles){
        if(role.capabilities) {
          for(let capability of role.capabilities){
            if(splitedString[0]===capability.code) {
              for(let complexity of capability.complexities){
                if(splitedString[1]===complexity.code) {
                  this.currentComplexityDetails.rolename=role.name;
                  this.currentComplexityDetails.capabilityName=capability.name;
                  this.currentComplexityDetails.name=complexity.name;
                  this.currentComplexityDetails.scenarios=complexity.scenarios.slice();
                  this.currentComplexityDetails.userChoice=this.complexities[this.complexityIds[this.currentComplexity]];
                  if (this.currentComplexityDetails.userChoice !== '-1') {
                    this.currentComplexityDetails.isChecked = true;
                  }
                  this.currentComplexityDetails.code=complexityId;
                  this.currentComplexityDetails.questionForCandidate='xxx xxxx xxxx xxxx'+complexity.name+'?';
                  this.currentComplexityDetails.questionForRecruiter='xxx xxxx xxxx xxxx'+complexity.name+'?';
                }
              }
            }
          }
        }
        if(role.default_complexities) {
          for(let capability of role.default_complexities){
            if(splitedString[0]===capability.code) {
              for(let complexity of capability.complexities){
                if(splitedString[1]===complexity.code) {
                  this.currentComplexityDetails.rolename=role.name;
                  this.currentComplexityDetails.capabilityName='Common Capability';
                  this.currentComplexityDetails.name=complexity.name;
                  this.currentComplexityDetails.scenarios=complexity.scenarios.slice();
                  this.currentComplexityDetails.userChoice=this.complexities[this.complexityIds[this.currentComplexity]];
                  this.currentComplexityDetails.code=complexityId;
                  this.currentComplexityDetails.questionForCandidate='xxx xxxx xxxx xxxx'+complexity.name+'?';
                  this.currentComplexityDetails.questionForRecruiter='xxx xxxx xxxx xxxx'+complexity.name+'?';
                }
              }
            }
          }
        }
      }
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
