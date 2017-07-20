import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CandidateProfileService } from '../candidate-profile/candidate-profile.service';
import { Candidate, Section } from '../model/candidate';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  moduleId: module.id,
  selector: 'cn-awards',
  templateUrl: 'awards.component.html',
  styleUrls: ['awards.component.css']
})

export class AwardsComponent implements OnInit {

  @Input() candidate: Candidate;
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();

  public awardDetail: FormGroup;


  private isButtonShow: boolean = false;
  private showButton: boolean = true;
  private submitStatus: boolean;
  tooltipMessage: string = "<ul><li><p>1. Award message</p></li></ul>";

  constructor(private _fb: FormBuilder, private profileCreatorService: CandidateProfileService) {
    this.awardDetail = this._fb.group({
      awards: this._fb.array([])
    });
  }

  ngOnInit() {
    //subscribe to addresses value changes
    this.awardDetail.controls['awards'].valueChanges.subscribe(x => {
      this.isButtonShow = true;
    });
  }

  ngOnChanges(changes: any) {
    if (changes.candidate.currentValue != undefined) {
      this.candidate = changes.candidate.currentValue;
      if (this.candidate.awards != undefined && this.candidate.awards.length > 0) {

        this.clearAwardDetails();
        let controlArray = <FormArray>this.awardDetail.controls['awards'];
        this.candidate.awards.forEach(item => {
          const fb = this.initAwardDetails();
          fb.patchValue(item);
          controlArray.push(fb);
        });
      }
      if (this.candidate.awards.length == 0) {
        this.addAward("fromNgOnChanges");
      }
    }
  }

  initAwardDetails() {
    return this._fb.group({
      remark: [''],
      name: ['', Validators.required],
      issuedBy: ['', Validators.required],
      year: ['', Validators.required]
    });
  }

  addAward(calledFrom: string) {
    if ((calledFrom == "fromNgOnChanges" && this.awardDetail.controls["awards"].value.length == 0) || calledFrom == "addAnother") {
      this.submitStatus = false;
      const control = <FormArray>this.awardDetail.controls['awards'];
      const addrCtrl = this.initAwardDetails();
      control.push(addrCtrl);
    }
  }

  removeAward(i: number) {
    const control = <FormArray>this.awardDetail.controls['awards'];
    control.removeAt(i);
    this.candidate.awards.splice(i, 1);
    this.postData('do_nothing');
  }

  clearAwardDetails() {
    const control = <FormArray>this.awardDetail.controls['awards'];
    for (let index = 0; index < control.length; index++) {
      control.removeAt(index);
    }
  }

  postData(type: string) {
    let isDataValid = false;

    if (type == 'delete') {
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
        });
      return;
    }

    let awards = this.awardDetail.value.awards;
    if(awards.length == 1){
      if (awards[0].issuedBy == "" && awards[0].name == ""
        && awards[0].year == "") {
        if (type == 'next') {
          this.onNext();
        }
        else if (type == 'save') {
          this.onSave();
        }
        return;
      }
    }

    for (let awardsData of this.awardDetail.value.awards) {
      if (awardsData.issuedBy != "" && awardsData.name != "" && awardsData.year != "") {
        isDataValid = true;
      } else if(awardsData.issuedBy != "" || awardsData.name != "" || awardsData.year != "") {
        this.submitStatus = true;
        return;
      } else {
        isDataValid = false;
        this.submitStatus = true;
        return;
      }
    }

    if (isDataValid) {
      this.candidate.awards = this.awardDetail.value.awards;
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
          if (type == 'next') {
            this.onNext();
          }
          else if (type == 'save') {
            this.onSave();
          }
        });
      return;
    }
    if (type === 'next') {
      this.onNext();
    } else if (type === 'save') {
      this.onSave();
    }
  }

  onNext() {
    this.onComplete.emit();
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
  }

  onSave() {
    this.onComplete.emit();
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
  }
}
