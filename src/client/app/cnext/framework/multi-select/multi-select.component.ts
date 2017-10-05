import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {MultiSelectService} from './multi-select.service';
import {CandidateProfileService} from '../candidate-profile/candidate-profile.service';
import {Messages} from '../../../shared/constants';
import {ErrorService} from '../../../shared/services/error.service';


@Component({
  moduleId: module.id,
  selector: 'cn-multi-select',
  templateUrl: 'multi-select.component.html',
  styleUrls: ['multi-select.component.css']
})

export class MultiSelectComponent implements OnChanges, OnInit {
  @Input() selectedData: string[];
  @Input() maxLength: number;
  @Input() type: string;
  @Input() data: string[];
  @Output() onComplete = new EventEmitter();
  @Input() submitStatus: boolean;
  @Input() requiredKeySkillsValidationMessage: string;
  @Input() maxKeySkillsValidationMessage: string;

  private selectedProficiencies: string[] = [];
  private masterDataProficiencies : string[]= [];
  private Proficiencies: string[] = [];
  private validationMessage: string;
  private showAlert: boolean = false;
  private alreadyPresent: boolean = false;
  private alreadyPresentinselected: boolean = false;
  private showModalStyle: boolean = false;
  private otherProficiency: string = '';
    private proficienciesPlaceholder: string = '';
  private disableTextField: boolean = false;
  private isInfoMessage: boolean = false;
  private noMatchFoundText :string=Messages.MSG_NO_MATCH_FOUND_TEXT;

  @ViewChild('myInput')
  private _inputElement: ElementRef;

  constructor(private proficiencydoaminService: MultiSelectService,
              private errorService:ErrorService,
              private profileCreatorService: CandidateProfileService) {
  }

    ngOnInit() {
        if (window.innerWidth < 1024) {
            this.proficienciesPlaceholder = Messages.KEYSKILLS_PLACEHOLDER_MOBILE;
        } else {
            this.proficienciesPlaceholder = Messages.KEYSKILLS_PLACEHOLDER_DESKTOP;
        }
  }

  ngOnChanges(changes: any) {
    if (this.data !== undefined) {
      if (this.data.length > 0) {
        this.Proficiencies = this.data;
        for(let item of this.Proficiencies) {
          if(item.length===1) {
            this.Proficiencies.splice(this.Proficiencies.indexOf(item),1);
          }
        }
        this.masterDataProficiencies = this.data;
      }
    }
    if (this.selectedData !== undefined) {
      if (this.selectedData.length > 0) {
        this.selectedProficiencies = this.selectedData;
        for (let proficiency of this.selectedData) {
          this.deleteSelectedProfeciency(proficiency);
        }
      }
    }
  }

  selectedProficiencyModel(newVal: any) {
    this.validationMessage='';
    let setOfCapabilityNumber=[4,3,2,1];
    if (newVal.trim() !== '') {
      this.submitStatus = false;
      if (this.selectedProficiencies.length < this.maxLength) {
        this.disableTextField=false;
        if (this.selectedProficiencies.indexOf(newVal.trim()) === -1) {
          this.selectedProficiencies.push(newVal.trim());
          this.deleteSelectedProfeciency(newVal.trim());
          this.onComplete.emit(this.selectedProficiencies);
        }
        if(setOfCapabilityNumber.indexOf(this.selectedProficiencies.length) > -1) {
          this.isInfoMessage = true;
          this.validationMessage = `You can add ${this.maxLength - this.selectedProficiencies.length} more key skills.`;
          this.showAlert = true;
        }
        if(this.selectedProficiencies.length === this.maxLength){
          this.isInfoMessage = true;
          this.validationMessage = this.maxKeySkillsValidationMessage;
          this.showAlert = true;
        }
      } else {
        this.disableTextField=true;
        this.validationMessage=this.maxKeySkillsValidationMessage;
        this.showAlert = true;
        this.isInfoMessage = true;
      }
    }

    let emptyInputField: any = document.getElementById(this.type);
    emptyInputField.value = '';
  }

  deleteItem(newVal: any) {
    let setOfCapabilityNumber=[4,3,2,1];
    this.showAlert = false;
    this.isInfoMessage = false;
    for (let i = 0; i < this.selectedProficiencies.length; i++) {
      if (this.selectedProficiencies[i].trim() === newVal.currentTarget.id.trim()) {
        this.selectedProficiencies.splice(i, 1);
        if( newVal.currentTarget.id.trim().length>1) {
        this.Proficiencies.push(newVal.currentTarget.id.trim());}
      }
    }
    if(setOfCapabilityNumber.indexOf(this.selectedProficiencies.length) > 0) {
      this.disableTextField=false;
      this.isInfoMessage = true;
      this.validationMessage = `You can add ${this.maxLength - this.selectedProficiencies.length} more key skills.`;
      this.showAlert = true;
    }
    this.onComplete.emit(this.selectedProficiencies);
  }

  deleteSelectedProfeciency(newVal: any) {
    for (let i = 0; i < this.Proficiencies.length; i++) {
      if (this.Proficiencies[i].toUpperCase().trim() === newVal.toUpperCase().trim()) {
        this.Proficiencies.splice(i, 1);
        break;
      }
    }
  }

  showHideModal(newVal: any) {//TODO
    this.otherProficiency = newVal;

    if(this.selectedProficiencies.indexOf(newVal) ===-1) {
      if (newVal !== '' && this.masterDataProficiencies.indexOf(newVal) === -1) {

       //this.showModalStyle = true;
       this.addProficiencyToMasterData();
      } else {
        if (this.masterDataProficiencies.indexOf(newVal) !== -1) {
          this.addProficiencyToMasterData();
        }
      }
    } else {
      this.showModalStyle =false;
    }
  }
  /*onSkillChange(skill:string) {debugger
    let xyz:any=document.getElementById(this.type);
  if( xyz !==null && xyz.value !== null){
    this.noMatchFoundText=' \' '+xyz.value +' \' '+ Messages.MSG_NO_MATCH_FOUND_TEXT;
  }
    return this.noMatchFoundText;
  }*/
  getStyleModal() {
    if (this.showModalStyle) {
      this._inputElement.nativeElement.focus();
      return 'block';
    } else {
      return 'none';
    }
  }

  addProficiencyToMasterData() {
    if (this.otherProficiency !== undefined && this.otherProficiency.trim() !== ' ') {
      for (let i = 0; i < this.selectedProficiencies.length; i++) {
        if (this.selectedProficiencies[i].toUpperCase().trim() === this.otherProficiency.toUpperCase().trim()) {
          this.alreadyPresentinselected = true;
          this.alreadyPresent=true;
          break;
        }
      }
      if(!this.alreadyPresentinselected){
        for (let i = 0; i < this.masterDataProficiencies.length; i++) {
          if (this.masterDataProficiencies[i].toUpperCase().trim() === this.otherProficiency.toUpperCase().trim()) {
            this.alreadyPresent = true;
            this.selectedProficiencyModel(this.otherProficiency.trim());
            break;
          }
        }
      }
      if (this.alreadyPresent === false) {
        this.proficiencydoaminService.addProficiencyToMasterData(this.otherProficiency).subscribe(
          data => {
            console.log(data);
          },error => this.errorService.onError(error));
        this.selectedProficiencyModel(this.otherProficiency);
      }
    }
    this.alreadyPresent = false;
    this.alreadyPresentinselected=false;
    let emptyInputField: any = document.getElementById(this.type);
    emptyInputField.value = '';
  }
}
