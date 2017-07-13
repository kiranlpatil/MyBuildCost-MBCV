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
  }

  ngOnInit() {
    this.awardDetail = this._fb.group({
      awards: this._fb.array([])
    });

    //subscribe to addresses value changes
    this.awardDetail.controls['awards'].valueChanges.subscribe(x => {
      this.isButtonShow = true;
    });

    this.addAward();
  }

  ngOnChanges(changes: any) {
    if (changes.candidate.currentValue != undefined) {
      this.candidate = changes.candidate.currentValue;
      if (this.candidate.awards != undefined && this.candidate.awards.length > 0) {

        let controlArray = <FormArray>this.awardDetail.controls['awards'];
        this.candidate.awards.forEach(item => {
          const fb = this.initAwardDetails();
          fb.patchValue(item);
          controlArray.push(fb);
        });
        if (!this.candidate.awards) {
          this.addAward();
        }
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

  addAward() {
    this.submitStatus = false;
    const control = <FormArray>this.awardDetail.controls['awards'];
    const addrCtrl = this.initAwardDetails();
    control.push(addrCtrl);
  }

  removeAward(i: number) {
    const control = <FormArray>this.awardDetail.controls['awards'];
    control.removeAt(i);
    this.postData('do_nothing');
  }

  postData(type: string) {
    if(!this.awardDetail.valid){
      this.submitStatus = true;
      return;
    }
    this.candidate.awards = this.awardDetail.value.awards;
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        if (type === 'next') {
          this.onNext();
        }else if (type === 'save') {
          this.onSave();
        }
      });
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
