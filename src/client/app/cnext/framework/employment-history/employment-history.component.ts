import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {CandidateProfileService} from "../candidate-profile/candidate-profile.service";
import {Candidate, Section} from "../model/candidate";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Messages, Tooltip, Headings} from "../../../framework/shared/constants";
import {ErrorService} from "../error.service";

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
  @ViewChild('EmloymentHostoryParent') parentContainer: ElementRef;
  @ViewChild('EmloymentHostoryInner') innerContainer: ElementRef;
  isScrollActive: boolean = false;
  temp: number = 20;

  public employeeHistory: FormGroup;

  employemntHistoryHeader:string= Headings.EMPLOYMENT_HISTORY;
  error_msg: string;
  private emphis: EmpHis = new EmpHis();
  private chkEmployeeHistory: boolean = false;
  private isButtonShow: boolean = false;
  private showButton: boolean = true;
  private showAddButton: boolean = true;
  tooltipMessage: string = '<ul><li><p>1. '+ Tooltip.EMPLOYMENT_HISTORY_TOOLTIP+'</p></li></ul>';
  private submitStatus: boolean;
  private isValidservicePeriod: boolean = true;
  private serviceValidMessage: string = Messages.MSG_ERROR_VALIDATION_EMPLOYMENTHISTORY;

  constructor(private _fb: FormBuilder,
              private errorService:ErrorService,
              private profileCreatorService: CandidateProfileService) {
    this.employeeHistory = this._fb.group({
      employeeHistories: this._fb.array([])
    });
  }

  ngOnInit() {
    //subscribe to addresses value changes
    this.employeeHistory.controls['employeeHistories'].valueChanges.subscribe(x => {
      this.isButtonShow = true;
    });
  }

  ngAfterViewChecked() {
    if (this.isScrollActive) {
      this.scrollToBottom();
      this.isScrollActive = false;
    }
  }

  ngOnChanges(changes: any) {
    if (changes.candidate.currentValue != undefined) {
      this.candidate = changes.candidate.currentValue;
      if (this.candidate.employmentHistory != undefined && this.candidate.employmentHistory.length > 0) {

        this.emphis.employeeHistories = this.candidate.employmentHistory;

        this.clearEmployeeHistory();
        let controlArray = <FormArray>this.employeeHistory.controls['employeeHistories'];
        this.candidate.employmentHistory.forEach(item => {
          const fb = this.initEmployeeHistory();
          fb.patchValue(item);
          controlArray.push(fb);
        });
      }
      if (this.candidate.employmentHistory.length == 0) {
        this.addEmployeeHistory("fromNgOnChanges");
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

  addEmployeeHistory(calledFrom: string) {
    if ((calledFrom == "fromNgOnChanges" && this.employeeHistory.controls["employeeHistories"].value.length == 0) || calledFrom == "addAnother") {
      const control = <FormArray>this.employeeHistory.controls['employeeHistories'];
      const addrCtrl = this.initEmployeeHistory();
      control.push(addrCtrl);
      this.showAddButton = false;
    }

    this.isScrollActive = true;
  }

  scrollToBottom(): void {
    try {
      this.scroll(this.parentContainer.nativeElement, 0);
    } catch (err) {
    }
  }

  scroll(c: any, i: any) {
    const control = <FormArray>this.employeeHistory.controls['employeeHistories'];
    i++;
    if (i > control.length * 50) {
      this.temp = 40;
      return;
    }
    c.scrollTop = this.temp + 20;
    this.temp = c.scrollTop;
    setTimeout(() => {
      this.scroll(c, i);
    }, 20);
  }


  removeEmployeeHistory(i: number) {
    const control = <FormArray>this.employeeHistory.controls['employeeHistories'];
    control.removeAt(i);
    this.candidate.employmentHistory.splice(i, 1);
    this.postData('delete');
  }

  clearEmployeeHistory() {
    const control = <FormArray>this.employeeHistory.controls['employeeHistories'];
    for (let index = 0; index < control.length; index++) {
      control.removeAt(index);
    }
  }

  save(model: any) {         //TODO Remove it
  }

  postData(type: string) {
    let isDataValid = false;
    this.isValidservicePeriod = true;

    if (type == 'delete') {
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
        },error => this.errorService.onError(error));
      return;
    }

    let empHistory = this.employeeHistory.value.employeeHistories;
    if(empHistory.length == 1){
      if (empHistory[0].companyName == "" && empHistory[0].designation == ""
        && empHistory[0].from.month == "" && empHistory[0].from.year == ""
        && empHistory[0].to.month == "" && empHistory[0].to.year == "") {
        if (type == 'next') {
          this.onNext();
        }
        else if (type == 'save') {
          this.onSave();
        }
        return;
      }
    }

    for (let history of this.employeeHistory.value.employeeHistories) {
      if (history.companyName != "" && history.designation != ""
        && history.from.month != "" && history.from.year != ""
        && history.to.month != "" && history.to.year != "") {

        if((new Date(history.from.month +"-"+history.from.year) > new Date(history.to.month+"-"+history.to.year))) {
          this.isValidservicePeriod = false;
          return;
        }else{
          isDataValid = true;
        }


      } else if (history.companyName != "" || history.designation != ""
        || history.from.month != "" || history.from.year != ""
        || history.to.month != "" || history.to.year != "") {

        if (history.from.month == "" || history.from.year == ""
          || history.to.month == "" || history.to.year == "" ||
          (new Date(history.from.month +"-"+history.from.year) > new Date(history.to.month+"-"+history.to.year))) {
          this.isValidservicePeriod = false;
        }

        this.submitStatus = true;
        return;
      } else {
        this.isValidservicePeriod = false;
        isDataValid = false;
        this.submitStatus = true;
        return;
      }
    }


    if (isDataValid) {
      this.candidate.employmentHistory = this.employeeHistory.value.employeeHistories;
      this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
        user => {
          if (type == 'next') {
            this.onNext();
          }
          else if (type == 'save') {
            this.onSave();
          }
        },error => this.errorService.onError(error));
      return;
    }

    if (type == 'next') {
      this.onNext();
    }
    else if (type == 'save') {
      this.onSave();
    }

    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onNext() {
    this.submitStatus = false;
    this.onComplete.emit();
    this.highlightedSection.name = 'AcademicDetails';
    this.highlightedSection.isDisable = false;
  }

  onSave() {
    this.submitStatus = false;
    this.onComplete.emit();
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
  }

  onPrevious() {
    this.highlightedSection.name = 'AboutMySelf';
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onEdit() {
    this.highlightedSection.name = 'EmploymentHistory';
    this.highlightedSection.isDisable = true;
    this.showButton = false;
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

}

export class EmpHis {
  employeeHistories: any;
}


