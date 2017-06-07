import {Component, Input, Output, EventEmitter} from "@angular/core";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate, Section} from "../model/candidate";
import {FormGroup, FormArray, FormBuilder, Validators} from "@angular/forms";

@Component({
  moduleId: module.id,
  selector: 'cn-certification-accreditation',
  templateUrl: 'certification-accreditation.component.html',
  styleUrls: ['certification-accreditation.component.css']
})

export class CertificationAccreditationComponent {

  @Input() candidate:Candidate;
  @Input() highlightedSection:Section;
  @Output() onComplete = new EventEmitter();

  public certificationDetail:FormGroup;

  private showAddButton:boolean = true;

  private isButtonShow:boolean = false;
  private showButton:boolean = true;

  constructor(private _fb:FormBuilder, private profileCreatorService:CandidateProfileService) {
  }

  ngOnInit() {
    this.certificationDetail = this._fb.group({
      certifications: this._fb.array([])
    });

    //subscribe to addresses value changes
    this.certificationDetail.controls['certifications'].valueChanges.subscribe(x => {
      this.isButtonShow = true;
    })
  }

  ngOnChanges(changes:any) {
    if (changes.candidate.currentValue != undefined) {
      this.candidate = changes.candidate.currentValue;
      if (this.candidate.certifications != undefined && this.candidate.certifications.length > 0) {

        let controlArray = <FormArray>this.certificationDetail.controls['certifications'];
        this.candidate.certifications.forEach(item => {
          const fb = this.initCerificateDetails();
          fb.patchValue(item);
          controlArray.push(fb);
        });
        if (!this.candidate.certifications) {
          this.addCertification();
        }
      }
    }
  }

  initCerificateDetails() {
    return this._fb.group({
      remark: [''],
      name: ['', Validators.required],
      issuedBy: ['', Validators.required],
      year: ['', Validators.required]
    });
  }

  addCertification() {
    const control = <FormArray>this.certificationDetail.controls['certifications'];
    const addrCtrl = this.initCerificateDetails();
    control.push(addrCtrl);
    this.showAddButton=false;
  }

  removeCertification(i:number) {
    const control = <FormArray>this.certificationDetail.controls['certifications'];
    control.removeAt(i);
  }

  postData(type:string) {
    this.candidate.certifications = this.certificationDetail.value.certifications;
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
