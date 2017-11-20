import { Component, Input, EventEmitter, Output, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JobPosterModel } from '../../../../user/models/jobPoster';
import { ShowQcardviewService } from '../../showQCard.service';
import { Candidate } from '../../../../user/models/candidate';
import { QCardFilterService } from '../q-card-filter.service';
import { FilterService } from './filter.service';
import { QCardFilter } from '../../model/q-card-filter';
import { ErrorService } from '../../../../shared/services/error.service';
import { Label } from '../../../../shared/constants';

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
        //this.location = changes.candidate.locations;
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
        if(changes.candidate && changes.candidate.currentValue.interestedIndustries[0] !== 'None') {
          this.industryList = changes.selectedJob.currentValue.interestedIndustries;
        }
        this.location = changes.selectedJob.currentValue.location.city;
      }
    }

    if (changes.role) {
      //if(changes.role.currentValue) {
      this.isRecuirter = changes.role.currentValue;
      //}
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

  onError(err: any) {
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
    this.buildQuery();
    this.qCardFilterService.filterby(this.qCardFilter);
    this.changeFilter.emit(this.qCardFilter);
  }

  filterByEducation(event: any) {
    var value = event.target.value;
    if(value == '') {
      this.queryListRemove('(args.educationDataForFilter.indexOf(item.education.toLowerCase()) !== -1)');
    }
    if (event.target.checked) {
      this.qCardFilter.education.push(value);
    } else {
      var index = this.qCardFilter.education.indexOf(value);
      if (index > -1) {
        this.qCardFilter.education.splice(index, 1);
      }
    }
    if (this.qCardFilter.education.length) {
      this.queryListPush('(args.educationDataForFilter.indexOf(item.education.toLowerCase()) !== -1)');
    } else {
      this.queryListRemove('(args.educationDataForFilter.indexOf(item.education.toLowerCase()) !== -1)');
    }
    this.showClearFilter = true;
    this.buildQuery();
    this.qCardFilterService.filterby(this.qCardFilter);
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
    if (this.qCardFilter.interestedIndustries.length) {
      //Below commented line for AND logic
      //this.queryListPush('(item.interestedIndustries.filter(function (obj) {return args.industryExposureDataForFilter.indexOf(obj.toLowerCase()) !== -1;}).length == args.industryExposureDataForFilter.length)');
      this.queryListPush('(item.interestedIndustries.filter(function (obj) {return args.industryExposureDataForFilter.indexOf(obj.toLowerCase()) !== -1;}).length > 0)');
    } else {
      this.queryListRemove('(item.interestedIndustries.filter(function (obj) {return args.industryExposureDataForFilter.indexOf(obj.toLowerCase()) !== -1;}).length > 0)');
    }
    this.showClearFilter = true;
    this.buildQuery();
    this.qCardFilterService.filterby(this.qCardFilter);
    this.changeFilter.emit(this.qCardFilter);
  }

  filterByJoinTime(value: any) {
    if(value == ''){
      if (this.isRecuirter === true) {
        this.queryListRemove('((args.filterByJoinTime && item.noticePeriod) && (args.filterByJoinTime.toLowerCase() === item.noticePeriod.toLowerCase()))');
      }
      else if(this.isRecuirter === false) {
        this.queryListRemove('((args.filterByJoinTime && item.joiningPeriod) && (args.filterByJoinTime.toLowerCase() === item.joiningPeriod.toLowerCase()))');
      }
    } else if (value) {
      this.qCardFilter.joinTime = value;
      if (this.isRecuirter) {
          this.changeFilter.emit(this.qCardFilter);
      }
      if (!this.isRecuirter) {
        this.queryListPush('((args.filterByJoinTime && item.joiningPeriod) && (args.filterByJoinTime.toLowerCase() === item.joiningPeriod.toLowerCase()))');
      }
      this.showClearFilter = true;
    }
    this.buildQuery();
    this.qCardFilterService.filterby(this.qCardFilter);
    this.changeFilter.emit(this.qCardFilter);
  }

  selectSalaryMinModel(value: any) {
    if(value == ''){
      this.qCardFilter.minSalary = Number(this.salaryRangeList[0]);
      return;
    }
    this.qCardFilter.minSalary = value;
    this.qCardFilter.minSalary = Number(this.qCardFilter.minSalary.toString()) * 100000;
    this.salaryFilterBy();
  }

  selectSalaryMaxModel(value: any) {
    if(value == ''){
      if (this.isRecuirter) {
        this.queryListRemove('((Number(item.salary.split(" ")[0]) >= Number(args.salaryMinValue)) && ' +
          '(Number(item.salary.split(" ")[0]) <= Number(args.salaryMaxValue)))');
      }else if(!this.isRecuirter) {
        this.queryListRemove('((Number(args.salaryMinValue) <= Number(item.salaryMinValue)  && ' +
          'Number(item.salaryMinValue) <= Number(args.salaryMaxValue)) || (Number(args.salaryMinValue) ' +
          '<= Number(item.salaryMaxValue)  && Number(item.salaryMaxValue) <= Number(args.salaryMaxValue)))');
      }
      this.qCardFilter.maxSalary = Number(this.salaryRangeList[this.salaryRangeList.length -1]);
      return;
    }
    this.qCardFilter.maxSalary = value;
    this.qCardFilter.maxSalary = Number(this.qCardFilter.maxSalary.toString()) * 100000;
    this.salaryFilterBy();
  }

  salaryFilterBy() {debugger
    if (Number(this.qCardFilter.maxSalary) && Number(this.qCardFilter.minSalary)) {
      if(!this.isRecuirter) {
        this.queryListPush('((Number(args.salaryMinValue) <= Number(item.salaryMinValue)  && ' +
          'Number(item.salaryMinValue) <= Number(args.salaryMaxValue)) || (Number(args.salaryMinValue) ' +
          '<= Number(item.salaryMaxValue)  && Number(item.salaryMaxValue) <= Number(args.salaryMaxValue)))');
      }
      this.showClearFilter = true;
      this.buildQuery();
      this.qCardFilterService.filterby(this.qCardFilter);
      this.changeFilter.emit(this.qCardFilter);
    }
  }

  selectExperiencesMaxModel(value: any) {
    if(value == ''){
      if (this.isRecuirter) {
        this.queryListRemove('((Number(item.experience.split(" ")[0]) >= Number(args.minExperience)) && ' +
          '(Number(item.experience.split(" ")[0]) <= Number(args.maxExperience)))');
      }else if(!this.isRecuirter) {
        this.queryListRemove('((Number(args.minExperience) <= Number(item.minExperience)  && ' +
          'Number(item.minExperience) <= Number(args.maxExperience)) || (Number(args.minExperience) ' +
          '<= Number(item.maxExperience)  && Number(item.maxExperience) <= Number(args.maxExperience)))');
      }
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
      if(this.isRecuirter === false) {
        this.queryListPush('((Number(args.minExperience) <= Number(item.minExperience)  && ' +
          'Number(item.minExperience) <= Number(args.maxExperience)) || (Number(args.minExperience) ' +
          '<= Number(item.maxExperience)  && Number(item.maxExperience) <= Number(args.maxExperience)))');
      }
      this.showClearFilter = true;
      this.buildQuery();
      this.qCardFilterService.filterby(this.qCardFilter);
        this.changeFilter.emit(this.qCardFilter);
    }
  }

  jobsFilterByLocation(value: any) {
    if(value == ''){
      this.queryListRemove('(((args.filterByLocation && item.location))&&(args.filterByLocation.toLowerCase() === item.location.toLowerCase()))');
    }else if (value) {
      this.qCardFilter.location = value;
      this.queryListPush('(((args.filterByLocation && item.location))&&(args.filterByLocation.toLowerCase() === item.location.toLowerCase()))');
      this.showClearFilter = true;
    }
    this.buildQuery();
    this.qCardFilterService.filterby(this.qCardFilter);
    this.changeFilter.emit(this.qCardFilter);
  }

  candidatesFilterByLocation(value: any) {
    if (value == 'All') {
      this.qCardFilter.location = undefined;
      this.queryListPush('((args.filterByLocation && item.location) && ((args.filterByLocation.toLowerCase() === item.location.toLowerCase()) || (args.filterByLocation.toLowerCase() !== item.location.toLowerCase())))');
      this.queryListRemove('(((args.filterByLocation && item.location))&&(args.filterByLocation.toLowerCase() === item.location.toLowerCase()))');
    } else {
      this.qCardFilter.location = value;
      this.queryListPush('(((args.filterByLocation && item.location))&&(args.filterByLocation.toLowerCase() === item.location.toLowerCase()))');
      this.queryListRemove('((args.filterByLocation && item.location) && ((args.filterByLocation.toLowerCase() === item.location.toLowerCase()) || (args.filterByLocation.toLowerCase() !== item.location.toLowerCase())))');
    }
    this.showClearFilter = true;
    this.buildQuery();
    this.changeFilter.emit(this.qCardFilter);
    this.qCardFilterService.filterby(this.qCardFilter);
  }

  filterByCompanySize(value: any) {
    if(value == ''){
      this.queryListRemove('(((args.filterByCompanySize && item.company_size))&&(args.filterByCompanySize.toLowerCase() === item.company_size.toLowerCase()))');
    }
    if (value) {
      this.qCardFilter.companySize = value;
      this.queryListPush('(((args.filterByCompanySize && item.company_size))&&(args.filterByCompanySize.toLowerCase() === item.company_size.toLowerCase()))');
      this.showClearFilter = true;
    }
    this.buildQuery();
    this.qCardFilterService.filterby(this.qCardFilter);
    this.changeFilter.emit(this.qCardFilter);
  }

  queryListPush(query: string) {
    if (this.queryList.indexOf(query) == -1) {
      this.queryList.push(query);
    }
  }

  queryListRemove(query: string) {
    var i = this.queryList.indexOf(query);
    if (i != -1) {
      this.queryList.splice(i, 1);
    }
  }

  buildQuery() {
    var query = 'true';
    for (var i = 0; i < this.queryList.length; i++) {
      query = query + '&&' + this.queryList[i];
    }
    this.qCardFilter.query = query;
  }

  clearFilter() {
    this.showClearFilter = false;
    var query = 'true';
    this.userForm.reset();
    this.qCardFilter = new QCardFilter();
    this.queryList = new Array(0);
    this.qCardFilter.query = query;
    this.changeFilter.emit(this.qCardFilter);
    if (this.role) {
      if((<HTMLInputElement>document.getElementById('radio-button-1')) !== null &&
        (<HTMLInputElement>document.getElementById('radio-button-2')) !== null) {
        (<HTMLInputElement>document.getElementById('radio-button-1')).checked = false;
        (<HTMLInputElement>document.getElementById('radio-button-2')).checked = false;
      }
    }
    this.qCardFilterService.filterby(this.qCardFilter);
    this.changeFilter.emit(this.qCardFilter);
  }

  filterByMustHaveComplexity(event: any) {
    let value = event.target.checked;
    if(value) {
      this.qCardFilter.mustHaveComplexity = value;
      this.queryListPush('((args.filterByMustHaveComplexity && item.complexityIsMustHave) && ' +
        '(args.filterByMustHaveComplexity === item.complexityIsMustHave))');
      this.showClearFilter = true;
    } else {
      this.qCardFilter.mustHaveComplexity = value;
      this.queryListRemove('((args.filterByMustHaveComplexity && item.complexityIsMustHave) && ' +
        '(args.filterByMustHaveComplexity === item.complexityIsMustHave))');
    }
    this.buildQuery();
    this.changeFilter.emit(this.qCardFilter);
    this.qCardFilterService.filterby(this.qCardFilter);
  }

  getLabel() {
    return Label;
  }
}
