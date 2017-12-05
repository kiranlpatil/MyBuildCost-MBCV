import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {JobPosterModel} from "../../../../user/models/jobPoster";
import {ShowQcardviewService} from "../../showQCard.service";
import {Candidate} from "../../../../user/models/candidate";
import {QCardFilterService} from "../q-card-filter.service";
import {FilterService} from "./filter.service";
import {QCardFilter} from "../../model/q-card-filter";
import {ErrorService} from "../../../../shared/services/error.service";
import {Label} from "../../../../shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-filter',
  templateUrl: 'filter.component.html',
  styleUrls: ['filter.component.css']
})

export class FilterComponent implements OnChanges, OnInit {
  userForm: FormGroup;
  isRecuirter: boolean;
  showClearFilter: boolean;
  openEducationPanel: boolean = false;
  openExperiencePanel: boolean = false;
  openSalaryPanel: boolean = false;
  openCompanySizePanel: boolean = false;
  openLocationPanel: boolean = false;
  openCurrentLocationPanel: boolean = false;
  openKeyskillsPanel: boolean = false;
  openJoiningPeriodPanel: boolean = false;
  openDomainPanel: boolean = false;
  mustHaveComplexityPanel: boolean = false;
  isComplexityMustHaveMatrixPresent : boolean;
  isFilterVisible: boolean = false;
  proficiencyList: string[] = new Array(0);
  experienceRangeList: string[] = new Array(0);
  educationList: string[] = new Array(0);
  jointimeList: string[] = new Array(0);
  industryList: string[] = new Array(0);
  salaryRangeList: string[] = new Array(0);
  qCardFilter: QCardFilter = new QCardFilter();
  @Output() changeFilter: EventEmitter<QCardFilter> = new EventEmitter<QCardFilter>();

  @Input() private candidate: Candidate;
  @Input() private locations: any[];
  @Input() private role: boolean;
  @Input() private selectedJob: JobPosterModel;
  private isShowJobFilter: boolean = false;
  private locationList: string[] = new Array(0);
  private companySizeList: string[] = new Array(0);
  private queryList: string[] = new Array(0);
  private location: string[] = new Array(0);
  private All = 'All';


  constructor(private formBuilder: FormBuilder,
              private errorService:ErrorService,
              private showQCardview: ShowQcardviewService,
              private _filterService: FilterService,
              private qCardFilterService: QCardFilterService) {
    this.showQCardview.showJobQCardView$.subscribe(
      data => {
        this.isShowJobFilter = true;
      }
    );
    this.qCardFilterService.clearFilter$.subscribe(() => {
      this.clearFilter();
    });

    this.userForm = this.formBuilder.group({
      eduction: '', experienceMin: '', experienceMax: '', salaryMin: '', salaryMax: '', location: '',
      proficiencies: '', timetojoin: '', industry: '', companysize: '', mustHaveComplexity: ''
    });
  }

  ngOnChanges(changes: any) {
    if((changes.selectedJob && changes.selectedJob.currentValue)) {
      this.selectedJob = changes.selectedJob.currentValue;
      if(this.selectedJob.complexity_musthave_matrix) {
        for(let cap in this.selectedJob.complexity_musthave_matrix) {
          if(this.selectedJob.complexity_musthave_matrix[cap]) {
            this.isComplexityMustHaveMatrixPresent = true;
            break;
          } else {
            this.isComplexityMustHaveMatrixPresent = false;
          }
        }
      }
    }
    if (changes.candidate) {
      if (changes.candidate.currentValue) {
        this.proficiencyList = changes.candidate.currentValue.proficiencies;
        if(changes.candidate && changes.candidate.currentValue && changes.candidate.currentValue.interestedIndustries[0] !== 'None') {
          this.industryList = changes.candidate.currentValue.interestedIndustries;
        }
      }
    }

    if (changes.locations) {
      if (changes.locations.currentValue) {
        this.locationList = changes.locations.currentValue;
      }
    }

    if (changes.selectedJob) {
      if (changes.selectedJob.currentValue) {
        this.proficiencyList = changes.selectedJob.currentValue.proficiencies;
        if(changes.selectedJob && changes.selectedJob.currentValue.interestedIndustries[0] !== 'None') {
          this.industryList = changes.selectedJob.currentValue.interestedIndustries;
        }
        this.location = changes.selectedJob.currentValue.location.city;
      }
    }

    if (changes.role) {
      this.isRecuirter = changes.role.currentValue;
    }
  }

  ngOnInit() {
    this._filterService.getListForFilter()
      .subscribe(
        (list: any) => {
          //this.proficiencyList = list.proficiency;
          this.companySizeList = list.companysize;
          this.salaryRangeList = list.salaryRangeList;
          this.educationList = list.education;
          this.jointimeList = list.joining_period;
          //this.industryList = list.industry_exposure;
          this.experienceRangeList = list.experienceRangeList;
        },error => this.errorService.onError(error));
  }

  filterByProficiency(event: any) {
    var value = event.target.value;
    if (event.target.checked) {
      this.qCardFilter.proficiencies.push(value);
    } else {
      var index = this.qCardFilter.proficiencies.indexOf(value);
      if (index > -1) {
        this.qCardFilter.proficiencies.splice(index, 1);
      }
    }
    this.showClearFilter = true;
    this.changeFilter.emit(this.qCardFilter);
  }

  filterByEducation(event: any) {
    var value = event.target.value;
    if (event.target.checked) {
      this.qCardFilter.education.push(value);
    } else {
      var index = this.qCardFilter.education.indexOf(value);
      if (index > -1) {
        this.qCardFilter.education.splice(index, 1);
      }
    }
    this.showClearFilter = true;
    this.changeFilter.emit(this.qCardFilter);
  }

  filterByIndustryExposure(event: any) {
    var value = event.target.value;
    if (event.target.checked) {
      this.qCardFilter.interestedIndustries.push(value);
    } else {
      var index = this.qCardFilter.interestedIndustries.indexOf(value);
      if (index > -1) {
        this.qCardFilter.interestedIndustries.splice(index, 1);
      }
    }
    this.showClearFilter = true;
    this.changeFilter.emit(this.qCardFilter);
  }

  filterByJoinTime(value: any) {
      this.qCardFilter.joinTime = value;
      this.showClearFilter = true;
    this.changeFilter.emit(this.qCardFilter);
  }

  selectSalaryMinModel(value: any) {
    if (value == '') {
      this.qCardFilter.minSalary = Number(this.salaryRangeList[0]);
      return;
    }
    this.qCardFilter.minSalary = value;
    this.qCardFilter.minSalary = Number(this.qCardFilter.minSalary.toString());
    this.salaryFilterBy();
  }

  selectSalaryMaxModel(value: any) {
    if(value == ''){
      this.qCardFilter.maxSalary = Number(this.salaryRangeList[this.salaryRangeList.length -1]);
      return;
    }
    this.qCardFilter.maxSalary = value;
    this.qCardFilter.maxSalary = Number(this.qCardFilter.maxSalary.toString());
    this.salaryFilterBy();
  }

  salaryFilterBy() {
    if (Number(this.qCardFilter.maxSalary) && Number(this.qCardFilter.minSalary)) {
      this.showClearFilter = true;
      this.changeFilter.emit(this.qCardFilter);
    }
  }

  selectExperiencesMaxModel(value: any) {
    if(value == ''){
      this.qCardFilter.maxExperience = Number(this.experienceRangeList[this.experienceRangeList.length -1]);
      return;
    }
    this.qCardFilter.maxExperience = value;
    this.experienceFilterBy();

  }

  selectExperiencesMinModel(value: any) {
    if(value == ''){
      this.qCardFilter.minExperience = Number(this.experienceRangeList[0]);
      return;
    }
    this.qCardFilter.minExperience = value;
    this.experienceFilterBy();
  }

  experienceFilterBy() {
    if (Number(this.qCardFilter.minExperience) != undefined && Number(this.qCardFilter.maxExperience) != undefined) {
      this.showClearFilter = true;
      this.changeFilter.emit(this.qCardFilter);
    }
  }

  jobsFilterByLocation(value: any) {
      this.qCardFilter.location = value;
      this.showClearFilter = true;
    this.changeFilter.emit(this.qCardFilter);
  }

  candidatesFilterByLocation(value: any) {
    if (value == 'All') {
      this.qCardFilter.location = undefined;
    } else {
      this.qCardFilter.location = value;
    }
    this.showClearFilter = true;
    this.changeFilter.emit(this.qCardFilter);
  }

  filterByCompanySize(value: any) {
    if (value) {
      this.qCardFilter.companySize = value;
      this.showClearFilter = true;
    }
    this.changeFilter.emit(this.qCardFilter);
  }

  clearFilter() {
    this.showClearFilter = false;
    this.userForm.reset();
    this.qCardFilter = new QCardFilter();
    this.queryList = new Array(0);
    this.changeFilter.emit(this.qCardFilter);
    if (this.role) {
      if((<HTMLInputElement>document.getElementById('radio-button-1')) !== null &&
        (<HTMLInputElement>document.getElementById('radio-button-2')) !== null) {
        (<HTMLInputElement>document.getElementById('radio-button-1')).checked = false;
        (<HTMLInputElement>document.getElementById('radio-button-2')).checked = false;
      }
    }
  }

  filterByMustHaveComplexity(event: any) {
    let value = event.target.checked;
    if(value) {
      this.qCardFilter.mustHaveComplexity = value;
      this.showClearFilter = true;
    } else {
      this.qCardFilter.mustHaveComplexity = value;
    }
    this.changeFilter.emit(this.qCardFilter);
  }

  getLabel() {
    return Label;
  }
}
