import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CandidateProfileService } from '../candidate-profile/candidate-profile.service';
import { Candidate, Section } from '../model/candidate';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'cn-employment-history',
  templateUrl: 'employment-history.component.html',
  styleUrls: ['employment-history.component.css']
})

export class EmploymentHistoryComponent {
  @Input() candidate: Candidate;
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();

  public employeeHistory: FormGroup;

  error_msg: string;
  private emphis: EmpHis = new EmpHis();
  private chkEmployeeHistory: boolean = false;
  private isButtonShow: boolean = false;
  private showButton: boolean = true;
  private showAddButton: boolean = true;
  tooltipMessage: string = "<p class='info'>An individual may be exposed to multiple industries during the professional life.</p>";

  constructor(private _fb: FormBuilder, private profileCreatorService: CandidateProfileService) {
  }

  ngOnInit() {
    this.employeeHistory = this._fb.group({
      emplyeeHistories: this._fb.array([])
    });

    // add address
    //this.addEmployeeHistory();

    //subscribe to addresses value changes
    this.employeeHistory.controls['emplyeeHistories'].valueChanges.subscribe(x => {
      this.isButtonShow = true;
    })
  }

  ngOnChanges(changes: any) {
    /* if (this.candidate.employmentHistory.length == 0) {
     this.candidate.employmentHistory.push(new EmployementHistory());
     }
     else {
     this.isButtonShow = true;
     }*/
    if (changes.candidate.currentValue != undefined) {
      this.candidate = changes.candidate.currentValue;
      if (this.candidate.employmentHistory != undefined && this.candidate.employmentHistory.length > 0) {

        /*(<FormGroup>this.employeeHistory.controls['emplyeeHistories'])
         .setValue(this.candidate.employmentHistory, {onlySelf: true});*/

        this.emphis.emplyeeHistories = this.candidate.employmentHistory;
        /*for (let item of this.candidate.employmentHistory) {
         this.form.controls['students'].push(new FormControl('This will not show'));
         this.employeeHistory
         .patchValue(this.emphis);
         console.log(this.employeeHistory.value)
         }*/

        let controlArray = <FormArray>this.employeeHistory.controls['emplyeeHistories'];
        this.candidate.employmentHistory.forEach(item => {
          const fb = this.initEmployeeHistory();
          fb.patchValue(item);
          controlArray.push(fb);
        });
        if (!this.candidate.employmentHistory) {
          this.addEmployeeHistory();
        }

      }
    }
  }

  initEmployeeHistory() {
    return this._fb.group({
      companyName: ['', Validators.required],
      designation: ['', Validators.required],
      from: this._fb.group({
        month: ['', Validators.required],
        year: ['', Validators.required],
      }),
      to: this._fb.group({
        month: ['', Validators.required],
        year: ['', Validators.required],
      }),
      remarks: ['']
    });
  }

  addEmployeeHistory() {
    const control = <FormArray>this.employeeHistory.controls['emplyeeHistories'];
    const addrCtrl = this.initEmployeeHistory();
    control.push(addrCtrl);
    this.showAddButton = false;
    /* subscribe to individual address value changes
     addrCtrl.valueChanges.subscribe(x => {
     console.log(x);
     })*/
  }

  removeEmployeeHistory(i: number) {
    const control = <FormArray>this.employeeHistory.controls['emplyeeHistories'];
    control.removeAt(i);
    this.postData('delete');
  }

  save(model: any) {         //TODO Remove it
    console.log(this.employeeHistory);
    console.log(model);
  }

  postData(type: string) {
    this.candidate.employmentHistory = this.employeeHistory.value.emplyeeHistories;
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        if (type == 'next') {
          this.onNext();
        }
        else if (type == 'save') {
          this.onSave();
        }
      });
  }

  onNext() {
    this.onComplete.emit();
    this.highlightedSection.name = 'AcademicDetails';
    this.highlightedSection.isDisable = false;
  }

  onSave() {
    this.onComplete.emit();
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
  }

}

export class EmpHis {
  emplyeeHistories: any;
}


