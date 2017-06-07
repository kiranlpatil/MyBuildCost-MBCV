import {Component, Input, EventEmitter, Output} from "@angular/core";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate, Section} from "../model/candidate";
import {FormGroup, FormArray, FormBuilder, Validators} from "@angular/forms";


@Component({
  moduleId: module.id,
  selector: 'cn-awards',
  templateUrl: 'awards.component.html',
  styleUrls: ['awards.component.css']
})

export class AwardsComponent {

  @Input() candidate:Candidate;
  @Input() highlightedSection:Section;
  @Output() onComplete = new EventEmitter();

  public awardDetail:FormGroup;
  private showAddButton:boolean = true;


  private isButtonShow:boolean = false;
  private showButton:boolean = true;

  constructor(private _fb:FormBuilder, private profileCreatorService:CandidateProfileService) {
  }

  ngOnInit() {
    this.awardDetail = this._fb.group({
      awards: this._fb.array([])
    });

    //subscribe to addresses value changes
    this.awardDetail.controls['awards'].valueChanges.subscribe(x => {
      this.isButtonShow = true;
    })
  }

  ngOnChanges(changes:any) {
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
    const control = <FormArray>this.awardDetail.controls['awards'];
    const addrCtrl = this.initAwardDetails();
    control.push(addrCtrl);
    this.showAddButton=false;
  }

  removeAward(i:number) {
    const control = <FormArray>this.awardDetail.controls['awards'];
    control.removeAt(i);
  }

  postData(type:string) {
    this.candidate.awards = this.awardDetail.value.awards;
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
          if (type == 'next') {
            this.onNext();
          }
          else if (type == 'save') {
            this.onSave()
          }
        });
  }

  onNext() {
    this.onComplete.emit();
    this.highlightedSection.name = "none";
    this.highlightedSection.isDisable = false;
  }

  onSave() {
    this.onComplete.emit();
    this.highlightedSection.name = "none";
    this.highlightedSection.isDisable = false;
  }
}
