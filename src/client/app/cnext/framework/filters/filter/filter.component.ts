import {Component, Input} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {JobPosterModel} from "../../model/jobPoster";
import {ShowQcardviewService} from "../../showQCard.service";
import {Candidate} from "../../model/candidate";
import {QCardFilterService} from "../q-card-filter.service";
import {FilterService} from "./filter.service";
import {QCardFilter} from "../../model/q-card-filter";
import {ErrorService} from "../../error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-filter',
  templateUrl: 'filter.component.html',
  styleUrls: ['filter.component.css']
})

export class FilterComponent {
  @Input() private candidate: Candidate;
  @Input() private locations: any[];
  @Input() private role: boolean;
  @Input() private selectedJob: JobPosterModel;


  private isShowJobFilter: boolean = false;
  private isFilterVisible: boolean = false;
  private proficiencyList: string[] = new Array(0);
  private locationList: string[] = new Array(0);
  private experienceRangeList: string[] = new Array(0);
  private educationList: string[] = new Array(0);
  private jointimeList: string[] = new Array(0);
  private industryList: string[] = new Array(0);
  private salaryRangeList: string[] = new Array(0);
  private companySizeList: string[] = new Array(0);
  private queryList: string[] = new Array(0);
  private qCardFilter: QCardFilter = new QCardFilter();
  private location: string[] = new Array(0);
  private All = 'All';
  private userForm: FormGroup;
  private isRecuirter: boolean;
  private showClearFilter: boolean;

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
      proficiencies: '', timetojoin: '', industry: '', companysize: ''
    });
  }

  ngOnChanges(changes: any) {
    if (changes.candidate) {
      if (changes.candidate.currentValue) {
        this.proficiencyList = changes.candidate.currentValue.proficiencies;
        if(changes.candidate && changes.candidate.currentValue && changes.candidate.currentValue.interestedIndustries[0]!='None') {
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
        if(changes.candidate && changes.candidate.currentValue.interestedIndustries[0] != 'None') {
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
    console.log('error on filter data load');
  }

  filterByProficiency(event: any) {
    var value = event.target.value;
    if (event.target.checked) {
      this.qCardFilter.proficiencyDataForFilter.push(value.toLowerCase())
    } else {
      var index = this.qCardFilter.proficiencyDataForFilter.indexOf(value.toLowerCase());
      if (index > -1) {
        this.qCardFilter.proficiencyDataForFilter.splice(index, 1);
      }
    }
    if (this.qCardFilter.proficiencyDataForFilter.length) {
      this.queryListPush('(item.proficiencies.filter(function (obj) {return args.proficiencyDataForFilter.indexOf(obj.toLowerCase()) !== -1;}).length == args.proficiencyDataForFilter.length)');
    } else {
      this.queryListRemove('(item.proficiencies.filter(function (obj) {return args.proficiencyDataForFilter.indexOf(obj.toLowerCase()) !== -1;}).length == args.proficiencyDataForFilter.length)');
    }
    this.showClearFilter = true;
    this.buildQuery();
    this.qCardFilterService.filterby(this.qCardFilter);
  }

  filterByEducation(event: any) {
    var value = event.target.value;
    if(value == ''){
      this.queryListRemove('(args.educationDataForFilter.indexOf(item.education.toLowerCase()) !== -1)');
    }
    if (event.target.checked) {
      this.qCardFilter.educationDataForFilter.push(value.toLowerCase())
    } else {
      var index = this.qCardFilter.educationDataForFilter.indexOf(value.toLowerCase());
      if (index > -1) {
        this.qCardFilter.educationDataForFilter.splice(index, 1);
      }
    }
    if (this.qCardFilter.educationDataForFilter.length) {
      this.queryListPush('(args.educationDataForFilter.indexOf(item.education.toLowerCase()) !== -1)');
    } else {
      this.queryListRemove('(args.educationDataForFilter.indexOf(item.education.toLowerCase()) !== -1)');
    }
    this.showClearFilter = true;
    this.buildQuery();
    this.qCardFilterService.filterby(this.qCardFilter);
  }

  filterByIndustryExposure(event: any) {
    var value = event.target.value;
    if (event.target.checked) {
      this.qCardFilter.industryExposureDataForFilter.push(value.toLowerCase())
    } else {
      var index = this.qCardFilter.industryExposureDataForFilter.indexOf(value.toLowerCase());
      if (index > -1) {
        this.qCardFilter.industryExposureDataForFilter.splice(index, 1);
      }
    }
    if (this.qCardFilter.industryExposureDataForFilter.length) {
      this.queryListPush('(item.interestedIndustries.filter(function (obj) {return args.industryExposureDataForFilter.indexOf(obj.toLowerCase()) !== -1;}).length == args.industryExposureDataForFilter.length)');
    } else {
      this.queryListRemove('(item.interestedIndustries.filter(function (obj) {return args.industryExposureDataForFilter.indexOf(obj.toLowerCase()) !== -1;}).length == args.industryExposureDataForFilter.length)');
    }
    this.showClearFilter = true;
    this.buildQuery();
    this.qCardFilterService.filterby(this.qCardFilter);
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
      this.qCardFilter.filterByJoinTime = value;
      if (this.isRecuirter === true) {
        this.queryListPush('((args.filterByJoinTime && item.noticePeriod) && (args.filterByJoinTime.toLowerCase() === item.noticePeriod.toLowerCase()))');
      }
      if (this.isRecuirter === false) {
        this.queryListPush('((args.filterByJoinTime && item.joiningPeriod) && (args.filterByJoinTime.toLowerCase() === item.joiningPeriod.toLowerCase()))');
      }
      this.showClearFilter = true;
    }
    this.buildQuery();
    this.qCardFilterService.filterby(this.qCardFilter);
  }

  selectSalaryMinModel(value: any) {
    if(value == ''){
      this.qCardFilter.salaryMinValue = this.salaryRangeList[0];
      return
    }
    this.qCardFilter.salaryMinValue = value;
    this.salaryFilterBy();
  }

  selectSalaryMaxModel(value: any) {
    if(value == ''){
      if (this.isRecuirter === true) {
        this.queryListRemove('((Number(item.salary.split(" ")[0]) >= Number(args.salaryMinValue)) && ' +
          '(Number(item.salary.split(" ")[0]) <= Number(args.salaryMaxValue)))');
      }else if(this.isRecuirter === false) {
        this.queryListRemove('((Number(args.salaryMinValue) <= Number(item.salaryMinValue)  && ' +
          'Number(item.salaryMinValue) <= Number(args.salaryMaxValue)) || (Number(args.salaryMinValue) ' +
          '<= Number(item.salaryMaxValue)  && Number(item.salaryMaxValue) <= Number(args.salaryMaxValue)))');
      }
      this.qCardFilter.salaryMaxValue = this.salaryRangeList[this.salaryRangeList.length -1];
      return
    }
    this.qCardFilter.salaryMaxValue = value;
    this.salaryFilterBy();
  }

  salaryFilterBy() {
    if (Number(this.qCardFilter.salaryMaxValue) && Number(this.qCardFilter.salaryMinValue)) {
      if (this.isRecuirter === true) {
        this.queryListPush('((Number(item.salary.split(" ")[0]) >= Number(args.salaryMinValue)) && ' +
          '(Number(item.salary.split(" ")[0]) <= Number(args.salaryMaxValue)))');
      }else if(this.isRecuirter === false) {
        this.queryListPush('((Number(args.salaryMinValue) <= Number(item.salaryMinValue)  && ' +
          'Number(item.salaryMinValue) <= Number(args.salaryMaxValue)) || (Number(args.salaryMinValue) ' +
          '<= Number(item.salaryMaxValue)  && Number(item.salaryMaxValue) <= Number(args.salaryMaxValue)))');
      }
      this.showClearFilter = true;
      this.buildQuery();
      this.qCardFilterService.filterby(this.qCardFilter);
    }
  }

  selectExperiencesMaxModel(value: any) {
    if(value == ''){
      if (this.isRecuirter === true) {
        this.queryListRemove('((Number(item.experience.split(" ")[0]) >= Number(args.experienceMinValue)) && ' +
          '(Number(item.experience.split(" ")[0]) <= Number(args.experienceMaxValue)))');
      }else if(this.isRecuirter === false) {
        this.queryListRemove('((Number(args.experienceMinValue) <= Number(item.experienceMinValue)  && ' +
          'Number(item.experienceMinValue) <= Number(args.experienceMaxValue)) || (Number(args.experienceMinValue) ' +
          '<= Number(item.experienceMaxValue)  && Number(item.experienceMaxValue) <= Number(args.experienceMaxValue)))');
      }
      this.qCardFilter.experienceMaxValue = this.experienceRangeList[this.experienceRangeList.length -1];
      return
    }
    this.qCardFilter.experienceMaxValue = value;
    this.experienceFilterBy();

  }

  selectExperiencesMinModel(value: any) {
    if(value == ''){
      this.qCardFilter.experienceMinValue = this.experienceRangeList[0];
      return
    }
    this.qCardFilter.experienceMinValue = value;
    this.experienceFilterBy();
  }

  experienceFilterBy() {
    if (Number(this.qCardFilter.experienceMinValue) != undefined && Number(this.qCardFilter.experienceMaxValue) != undefined) {
      if (this.isRecuirter === true) {
        this.queryListPush('((Number(item.experience.split(" ")[0]) >= Number(args.experienceMinValue)) && ' +
          '(Number(item.experience.split(" ")[0]) <= Number(args.experienceMaxValue)))');
      }else if(this.isRecuirter === false) {
        this.queryListPush('((Number(args.experienceMinValue) <= Number(item.experienceMinValue)  && ' +
          'Number(item.experienceMinValue) <= Number(args.experienceMaxValue)) || (Number(args.experienceMinValue) ' +
          '<= Number(item.experienceMaxValue)  && Number(item.experienceMaxValue) <= Number(args.experienceMaxValue)))');
      }
      this.showClearFilter = true;
      this.buildQuery();
      this.qCardFilterService.filterby(this.qCardFilter);
    }
  }

  jobsFilterByLocation(value: any) {
    if(value == ''){
      this.queryListRemove('(((args.filterByLocation && item.location))&&(args.filterByLocation.toLowerCase() === item.location.toLowerCase()))');
    }else if (value) {
      this.qCardFilter.filterByLocation = value;
      this.queryListPush('(((args.filterByLocation && item.location))&&(args.filterByLocation.toLowerCase() === item.location.toLowerCase()))');
      this.showClearFilter = true;
    }
    this.buildQuery();
    this.qCardFilterService.filterby(this.qCardFilter);
  }

  candidatesFilterByLocation(value: any) {
    this.qCardFilter.filterByLocation = value;
    if (value == 'All') {
      this.queryListPush('((args.filterByLocation && item.location) && ((args.filterByLocation.toLowerCase() === item.location.toLowerCase()) || (args.filterByLocation.toLowerCase() !== item.location.toLowerCase())))');
      this.queryListRemove('(((args.filterByLocation && item.location))&&(args.filterByLocation.toLowerCase() === item.location.toLowerCase()))');
    } else {
      this.queryListPush('(((args.filterByLocation && item.location))&&(args.filterByLocation.toLowerCase() === item.location.toLowerCase()))');
      this.queryListRemove('((args.filterByLocation && item.location) && ((args.filterByLocation.toLowerCase() === item.location.toLowerCase()) || (args.filterByLocation.toLowerCase() !== item.location.toLowerCase())))');
    }
    this.showClearFilter = true;
    this.buildQuery();
    this.qCardFilterService.filterby(this.qCardFilter);

  }

  filterByCompanySize(value: any) {
    if(value == ''){
      this.queryListRemove('(((args.filterByCompanySize && item.company_size))&&(args.filterByCompanySize.toLowerCase() === item.company_size.toLowerCase()))');
    }
    if (value) {
      this.qCardFilter.filterByCompanySize = value;
      this.queryListPush('(((args.filterByCompanySize && item.company_size))&&(args.filterByCompanySize.toLowerCase() === item.company_size.toLowerCase()))');
      this.showClearFilter = true;
    }
    this.buildQuery();
    this.qCardFilterService.filterby(this.qCardFilter);
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
    if (this.role) {
      if((<HTMLInputElement>document.getElementById('radio-button-1'))!=null && (<HTMLInputElement>document.getElementById('radio-button-2'))!=null){
        (<HTMLInputElement>document.getElementById('radio-button-1')).checked = false;
        (<HTMLInputElement>document.getElementById('radio-button-2')).checked = false;
      }
    }
    this.qCardFilterService.filterby(this.qCardFilter);
  }
}
