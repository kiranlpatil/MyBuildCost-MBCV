import {Component, Input, Output, EventEmitter} from "@angular/core";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate, Section} from "../model/candidate";
import {FormGroup, FormArray, FormBuilder, Validators} from "@angular/forms";

@Component({
  moduleId: module.id,
  selector: 'cn-academic-details',
  templateUrl: 'academic-details.component.html',
  styleUrls: ['academic-details.component.css']
})

export class AcademicDetailComponent {
  @Input() candidate:Candidate;
  @Input() highlightedSection:Section;
  @Output() onComplete = new EventEmitter();

  public academicDetail:FormGroup;


  private isButtonShow:boolean = false;
  private showButton:boolean = true;

  constructor(private _fb:FormBuilder, private profileCreatorService:CandidateProfileService) {
  }

  ngOnInit() {
    this.academicDetail = this._fb.group({
      acdemicDetails: this._fb.array([])
    });

    //subscribe to addresses value changes
    this.academicDetail.controls['acdemicDetails'].valueChanges.subscribe(x => {
      this.isButtonShow = true;
    })
  }

  ngOnChanges(changes:any) {
    if (changes.candidate.currentValue != undefined) {
      this.candidate = changes.candidate.currentValue;
      if (this.candidate.academics != undefined && this.candidate.academics.length > 0) {

        let controlArray = <FormArray>this.academicDetail.controls['acdemicDetails'];
        this.candidate.academics.forEach(item => {
          const fb = this.initAcademicDetails();
          fb.patchValue(item);
          controlArray.push(fb);
        });
        if (!this.candidate.academics) {
          this.addAcdemicDetail();
        }
      }
    }
  }

  initAcademicDetails() {
    return this._fb.group({
      schoolName: [''],
      board: ['', Validators.required],
      yearOfPassing: ['', Validators.required],
      specialization: ['', Validators.required]
    });
  }

  addAcdemicDetail() {
    const control = <FormArray>this.academicDetail.controls['acdemicDetails'];
    const addrCtrl = this.initAcademicDetails();
    control.push(addrCtrl);
  }

  removeAcdemicDetail(i:number) {
    const control = <FormArray>this.academicDetail.controls['acdemicDetails'];
    control.removeAt(i);
  }
  
  postData(type:string) {
    this.candidate.academics = this.academicDetail.value.acdemicDetails;
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
    this.highlightedSection.name = "Certification";
    this.highlightedSection.isDisable = false;
  }

  onSave() {
    this.onComplete.emit();
    this.highlightedSection.name = "none";
    this.highlightedSection.isDisable = false;
  }


}
