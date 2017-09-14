import JobProfileModel = require('../../dataaccess/model/jobprofile.model');
import CandidateRepository = require('../../dataaccess/repository/candidate.repository');
import ProjectAsset = require('../../shared/projectasset');
import RecruiterRepository = require('../../dataaccess/repository/recruiter.repository');
import CandidateModel = require('../../dataaccess/model/candidate.model');
import JobProfileService = require('../../services/jobprofile.service');
import { Actions, ConstVariables } from '../../shared/sharedconstants';
import { ProfileComparisonDataModel, SkillStatus } from '../../dataaccess/model/profile-comparison-data.model';
import { CapabilityMatrixModel } from '../../dataaccess/model/capability-matrix.model';
import { ProfileComparisonModel } from '../../dataaccess/model/profile-comparison.model';
import { ProfileComparisonJobModel } from '../../dataaccess/model/profile-comparison-job.model';
import MatchViewModel = require('../../dataaccess/model/match-view.model');
import Match = require('../../dataaccess/model/match-enum');
import IndustryRepository = require('../../dataaccess/repository/industry.repository');
import IndustryModel = require('../../dataaccess/model/industry.model');
import ScenarioModel = require('../../dataaccess/model/scenario.model');
let usestracking = require('uses-tracking');

class SearchService {
  APP_NAME: string;
  candidateRepository: CandidateRepository;
  recruiterRepository: RecruiterRepository;
  industryRepository: IndustryRepository;
  private usesTrackingController: any;

  constructor() {
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.candidateRepository = new CandidateRepository();
    this.recruiterRepository = new RecruiterRepository();
    this.industryRepository = new IndustryRepository();
    let obj: any = new usestracking.MyController();
    this.usesTrackingController = obj._controller;
  }

  getMatchingCandidates(jobProfile: JobProfileModel, callback: (error: any, result: any) => void) {
    console.time('getMatching Candidate');
    let data: any;
    let isFound: boolean = false;
    let industries: string[] = [];
    let isReleventIndustriesFound: boolean = false;
    if (jobProfile.interestedIndustries && jobProfile.interestedIndustries.length > 0) {
      /*isFound= jobProfile.interestedIndustries.filter((name : string)=> {
       if(name === 'None'){
       return name;
       }
       });*/
      //jobProfile.releventIndustries = ['Textile'];
      for (let name of jobProfile.interestedIndustries) {
        if (name === 'None') {
          isFound = true;
        }
      }
      if(jobProfile.releventIndustries && jobProfile.releventIndustries.length) {
        isReleventIndustriesFound = true;
      }
      if (isFound) {

        if(isReleventIndustriesFound) {
          industries = jobProfile.releventIndustries;

          industries.push(jobProfile.industry.name);
          data = {
            'industry.name': {$in: industries},
            $or: [
              {'professionalDetails.relocate': 'Yes'},
              {'location.city': jobProfile.location.city}
            ],
            'proficiencies': {$in: jobProfile.proficiencies},
            'isVisible': true,
          };
        } else {
          data = {
            'industry.name': jobProfile.industry.name,
            $or: [
              {'professionalDetails.relocate': 'Yes'},
              {'location.city': jobProfile.location.city}
            ],
            'proficiencies': {$in: jobProfile.proficiencies},
            'isVisible': true,
          };
        }
      } else {
        if(isReleventIndustriesFound) {
          industries = jobProfile.releventIndustries;
          industries.push(jobProfile.industry.name);
          data = {
            'industry.name': {$in: industries},
            $or: [
              {'professionalDetails.relocate': 'Yes'},
              {'location.city': jobProfile.location.city}
            ],
            'proficiencies': {$in: jobProfile.proficiencies},
            'interestedIndustries': {$in: jobProfile.interestedIndustries},
            'isVisible': true,
          };
        } else {
          data = {
            'industry.name': jobProfile.industry.name,
            $or: [
              {'professionalDetails.relocate': 'Yes'},
              {'location.city': jobProfile.location.city}
            ],
            'proficiencies': {$in: jobProfile.proficiencies},
            'interestedIndustries': {$in: jobProfile.interestedIndustries},
            'isVisible': true,
          };
        }
      }

    } else {
      data = {
        'isVisible': true,
        'industry.name': jobProfile.industry.name,
        'proficiencies': {$in: jobProfile.proficiencies},
        $or: [
          {'professionalDetails.relocate': 'Yes'},
          {'location.city': jobProfile.location.city}
        ]
      };
    }
    let included_fields = {
      'industry.roles.capabilities.complexities.scenarios.code': 1,
      'industry.roles.capabilities.complexities.scenarios.isChecked': 1,
      'industry.roles.default_complexities.complexities.scenarios.code': 1,
      'industry.roles.default_complexities.complexities.scenarios.isChecked': 1,
      'userId': 1,
      'proficiencies': 1,
      'location': 1,
      'interestedIndustries': 1,
      'professionalDetails': 1,
      'capability_matrix':1
    };
    this.candidateRepository.retrieveWithLean(data, included_fields, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        // callback(null, res);
        this.candidateRepository.getCandidateQCard(res, jobProfile, undefined, callback);
      }
    });
  }

  getMatchingJobProfile(candidate: CandidateModel, callback: (error: any, result: any) => void) {

    let currentDate = new Date();
    let data = {
      'postedJobs.industry.name': candidate.industry.name,
      'postedJobs.proficiencies': {$in: candidate.proficiencies},
      'postedJobs.expiringDate': {$gte: currentDate}
    };
    let excluded_fields = {
      'postedJobs.industry.roles': 0,
    };
    this.recruiterRepository.retrieveWithLean(data,excluded_fields, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        this.recruiterRepository.getJobProfileQCard(res, candidate, undefined, 'none', callback);
      }
    });
  }

  getMatchingResult(candidateId: string, jobId: string, isCandidate : boolean,callback: (error: any, result: any) => void) {
    let uses_data = {
      candidateId: candidateId,
      jobProfileId: jobId,
      timestamp: new Date(),
      action: Actions.DEFAULT_VALUE
    };
    if (isCandidate) {
      uses_data.action = Actions.VIEWED_JOB_PROFILE_BY_CANDIDATE;
    } else {
      uses_data.action = Actions.VIEWED_FULL_PROFILE_BY_RECRUITER;
    }
    this.usesTrackingController.create(uses_data);
    this.candidateRepository.findByIdwithExclude(candidateId,{'industry':0}, (err: any, candidateRes: any) => {
      if (err) {
        callback(err, null);
      } else {
        if (candidateRes) {
          let data = {
            'postedJob': jobId
          };
          let jobProfileService: JobProfileService = new JobProfileService();
          jobProfileService.retrieve(data, (errInJob, resOfRecruiter) => {
            if (errInJob) {
              callback(errInJob, null);
            } else {
              this.getResult(candidateRes, resOfRecruiter.postedJobs[0], isCandidate, callback);
            }
          });
        }
      }
    });
  }


  compareTwoOptions(first: number, second: number): string {
    if (first < second) {
      return 'below';
    } else if (first > second) {
      return 'above';
    } else {
      return 'exact';
    }
  }

  getEductionSwitchCase(education: string): number {
    switch (education) {
      case 'Under Graduate':
        return 1;
      case 'Graduate':
        return 2;
      case 'Post Graduate':
        return 3;
    }
    return -1;
  }

  getPeriodSwitchCase(period: string): number {//TO DO :Do not use hard coding
    switch (period) {
      case 'Immediate' :
        return 1;
      case 'Within 1 months':
        return 2;
      case '1-2 Months':
        return 3;
      case '2-3 Months':
        return 4;
      case 'Beyond 3 months':
        return 5;
    }
    return -1;
  }

  getResult(candidate: any, job: any, isCandidate: boolean, callback: (error: any, result: any) => void) {
    this.industryRepository.retrieve({'name': job.industry.name}, (err: any, industries: IndustryModel[]) => {
      if (err) {
        callback(err, null);
      } else {
        var newCandidate = this.getCompareData(candidate, job, isCandidate, industries);
        callback(null, newCandidate);
      }
    });
  }

  getCompareData(candidate: CandidateModel, job: any, isCandidate: boolean, industries: IndustryModel[]) {
    //let newCandidate = candidate.toObject();
    var newCandidate = this.buildCandidateModel(candidate);
    let jobMinExperience: number = Number(job.experienceMinValue);
    let jobMaxExperience: number = Number(job.experienceMaxValue);
    let jobMinSalary: number = Number(job.salaryMinValue);
    let jobMaxSalary: number = Number(job.salaryMaxValue);
    let candiExperience: string[] = newCandidate.professionalDetails.experience.split(' ');
    let canSalary: string[] = newCandidate.professionalDetails.currentSalary.split(' ');
    if ((jobMaxExperience >= Number(candiExperience[0])) && (jobMinExperience <= Number(candiExperience[0]))) {
      newCandidate.experienceMatch = 'exact';
    } else {
      newCandidate.experienceMatch = 'missing';
    }
    if ((jobMaxSalary >= Number(canSalary[0])) && (jobMinSalary <= Number(canSalary[0]))) {
      newCandidate.salaryMatch = 'exact';
    } else {
      newCandidate.salaryMatch = 'missing';
    }
    let canEducation: number = this.getEductionSwitchCase(newCandidate.professionalDetails.education);
    let jobEducation: number = this.getEductionSwitchCase(job.education);
    newCandidate.educationMatch = this.compareTwoOptions(canEducation, jobEducation);
    newCandidate.releaseMatch = this.compareTwoOptions(this.getPeriodSwitchCase(newCandidate.professionalDetails.noticePeriod), this.getPeriodSwitchCase(job.joiningPeriod));
    newCandidate.interestedIndustryMatch = new Array(0);

    for (let industry of job.interestedIndustries) {
      if (newCandidate.interestedIndustries.indexOf(industry) !== -1) {
        newCandidate.interestedIndustryMatch.push(industry);
      }
    }
    newCandidate.proficienciesMatch = new Array(0);
    for (let proficiency of job.proficiencies) {
      if (newCandidate.proficiencies.indexOf(proficiency) !== -1) {
        newCandidate.proficienciesMatch.push(proficiency);
      }
    }

    newCandidate.proficienciesUnMatch = new Array(0);
    for (let proficiency of job.proficiencies) {
      if (newCandidate.proficienciesMatch.indexOf(proficiency) == -1) {
        newCandidate.proficienciesUnMatch.push(proficiency);
      }
    }
//        let match_map: Map<string,MatchViewModel> = new Map<string,MatchViewModel>();
    //newCandidate.match_map = {};
    newCandidate = this.buildMultiCompareCapabilityView(job, newCandidate, industries, isCandidate);
    newCandidate = this.buildCompareView(job, newCandidate, industries, isCandidate);
    newCandidate = this.getAdditionalCapabilities(job, newCandidate, industries);

    return newCandidate;
  }

  buildCandidateModel(candidate: CandidateModel) {
    let profileComparisonResult: ProfileComparisonDataModel = new ProfileComparisonDataModel();
    profileComparisonResult._id = candidate._id;
    profileComparisonResult.industryName = candidate.industry.name;
    profileComparisonResult.aboutMyself = candidate.aboutMyself;
    profileComparisonResult.academics = candidate.academics;
    profileComparisonResult.professionalDetails = candidate.professionalDetails;
    //profileComparisonResult.additionalCapabilites = candidate.additionalCapabilites;
    profileComparisonResult.awards = candidate.awards;
    profileComparisonResult.capability_matrix = candidate.capability_matrix;
    //profileComparisonResult.capabilityMap = [];
    profileComparisonResult.experienceMatch = '';
    profileComparisonResult.certifications = candidate.certifications;
    //profileComparisonResult.companyCulture = '';
    profileComparisonResult.employmentHistory = candidate.employmentHistory;
    profileComparisonResult.interestedIndustries = candidate.interestedIndustries;
    profileComparisonResult.isSubmitted = candidate.isSubmitted;
    profileComparisonResult.isVisible = candidate.isVisible;
    profileComparisonResult.location = candidate.location;
    profileComparisonResult.job_list = candidate.job_list;
    //profileComparisonResult.matchingPercentage = 0;
    profileComparisonResult.educationMatch = '';
    profileComparisonResult.proficiencies = candidate.proficiencies;
    //profileComparisonResult.proficienciesMatch = [];
    profileComparisonResult.profileComparisonHeader = candidate.userId;
    profileComparisonResult.roleType = candidate.roleType;
    profileComparisonResult.salaryMatch = '';
    //profileComparisonResult.status = candidate.status;
    profileComparisonResult.secondaryCapability = candidate.secondaryCapability;
    profileComparisonResult.lockedOn = candidate.lockedOn;
    profileComparisonResult.match_map = {};
    profileComparisonResult.capabilityMap = {};
    //profileComparisonResult.proficienciesUnMatch = [];
    //profileComparisonResult.interestedIndustryMatch = [];
    //profileComparisonResult.releaseMatch = '';
    return profileComparisonResult;
  }

  buildMultiCompareCapabilityView(job:any, newCandidate:ProfileComparisonDataModel, industries:any, isCandidate:any) {
    var capabilityPercentage:number[] = new Array(0);
    var capabilityKeys:string[] = new Array(0);
    var correctQestionCountForAvgPercentage:number = 0;
    var qestionCountForAvgPercentsge:number = 0;
    for (let cap in job.capability_matrix) {

      var capabilityKey = cap.split('_');
      if (capabilityKeys.indexOf(capabilityKey[0]) == -1) {
        capabilityKeys.push(capabilityKey[0]);
      }
    }
    //for(let _cap in capbilityKeys) {
    for (let _cap of capabilityKeys) {
      let isCapabilityFound : boolean = false;
      var capabilityQuestionCount:number = 0;
      var matchCount:number = 0;
      for (let cap in job.capability_matrix) {
        //calculate total number of questions in capability

        if (_cap == cap.split('_')[0]) {
          if (job.capability_matrix[cap] == -1 || job.capability_matrix[cap] == 0 || job.capability_matrix[cap] == undefined) {
            //match_view.match = Match.MissMatch;
          } else if (job.capability_matrix[cap] == newCandidate.capability_matrix[cap]) {
            matchCount++;
            capabilityQuestionCount++;
            correctQestionCountForAvgPercentage++;
            qestionCountForAvgPercentsge++;
            //match_view.match = Match.Exact;
          } else if (job.capability_matrix[cap] == (Number(newCandidate.capability_matrix[cap]) - ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
            matchCount++;
            capabilityQuestionCount++;
            correctQestionCountForAvgPercentage++;
            qestionCountForAvgPercentsge++;
            //match_view.match = Match.Above;
          } else if (job.capability_matrix[cap] == (Number(newCandidate.capability_matrix[cap]) + ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
            //match_view.match = Match.Below;
            capabilityQuestionCount++;
            qestionCountForAvgPercentsge++;
          } else {
            capabilityQuestionCount++;
            qestionCountForAvgPercentsge++;
            //match_view.match = Match.MissMatch;
          }
        }
      }
      var capabilityModel = new CapabilityMatrixModel();
      var capName:string;
      var complexity:any;
      for (let role of industries[0].roles) {
        for (let capability of role.capabilities) {
          if (_cap == capability.code) {
            isCapabilityFound=true;
            capName = capability.name;
            complexity = capability.complexities;
            break;
          }
        }
        for (let capability of role.default_complexities) {
          if (_cap == capability.code) {
            isCapabilityFound=true;
            capName = capability.name;
            complexity = capability.complexities;
            break;
          }
        }
      }
      var percentage:number = 0;
      if (capabilityQuestionCount) {
        percentage = (matchCount / capabilityQuestionCount) * 100;
      }

      capabilityModel.capabilityName = capName;
      capabilityModel.capabilityPercentage = percentage;
      capabilityModel.complexities = complexity;
      capabilityPercentage.push(percentage);
      if(isCapabilityFound){
        newCandidate['capabilityMap'][_cap] = capabilityModel;
      }
      //}
    }
    var avgPercentage:number = 0;
    if (qestionCountForAvgPercentsge) {
      avgPercentage = ((correctQestionCountForAvgPercentage / qestionCountForAvgPercentsge) * 100);
    }
    newCandidate.matchingPercentage = avgPercentage;
    return newCandidate;
  }

  getAdditionalCapabilities(job : any, newCandidate : any , industries : any) : any {
    newCandidate.additionalCapabilites = new Array(0);
    for (let cap in newCandidate.capability_matrix) {
        let isFound: boolean= false;
        for(let jobCap in job.capability_matrix) {
            if(cap.substr(0,cap.indexOf('_')) === jobCap.substr(0,jobCap.indexOf('_'))) {
              isFound=true;
              break;
            }
        }
        if(!isFound) {
          for (let role of industries[0].roles) {
            for (let capability of role.capabilities) {
              for (let complexity of capability.complexities) {
                let custom_code = capability.code + '_' + complexity.code;
                if (custom_code === cap) {
                  if(newCandidate.additionalCapabilites.indexOf(capability.name) == -1) {
                    newCandidate.additionalCapabilites.push(capability.name);
                  }
                }
              }
            }
          }
        }
    }

      return newCandidate;
  }

  buildCompareView(job : any, newCandidate : any , industries : any, isCandidate : boolean) : any {

    for (let cap in job.capability_matrix) {
      let match_view: MatchViewModel = new MatchViewModel();
      if (job.capability_matrix[cap] == -1 || job.capability_matrix[cap] == 0 || job.capability_matrix[cap] == undefined || newCandidate.capability_matrix[cap] == undefined ||
        newCandidate.capability_matrix[cap] == 0 || newCandidate.capability_matrix[cap] == -1) {
        match_view.match = Match.MissMatch;
      } else if (job.capability_matrix[cap] == newCandidate.capability_matrix[cap]) {
        match_view.match = Match.Exact;
      } else if (job.capability_matrix[cap] == (Number(newCandidate.capability_matrix[cap]) - ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
        match_view.match = Match.Above;
      } else if (job.capability_matrix[cap] == (Number(newCandidate.capability_matrix[cap]) + ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
        match_view.match = Match.Below;
      } else {
        match_view.match = Match.MissMatch;
      }
      let isFound: boolean = false;
      for (let role of industries[0].roles) {
        for (let capability of role.capabilities) {
          for (let complexity of capability.complexities) {
            let custom_code = capability.code + '_' + complexity.code;
            if (custom_code === cap) {
              isFound = true;
              let scenarios = complexity.scenarios.filter((sce: ScenarioModel) => {
                sce.code =sce.code.replace('.','_');
                sce.code =sce.code.replace('.','_');
                sce.code = sce.code.substr(sce.code.lastIndexOf('_')+1);
                if(sce.code == newCandidate.capability_matrix[cap])  {
                  return true;
                }else {
                  return false;
                }
              });
              let job_scenarios = complexity.scenarios.filter((sce: ScenarioModel) => {
                sce.code =sce.code.replace('.','_');
                sce.code =sce.code.replace('.','_');
                sce.code = sce.code.substr(sce.code.lastIndexOf('_')+1);
                if(sce.code == job.capability_matrix[cap])  {
                  return true;
                }else {
                  return false;
                }
              });
              match_view.capability_name = capability.name;
              match_view.complexity_name = complexity.name;
              if(job_scenarios[0]) {
                match_view.job_scenario_name= job_scenarios[0].name;
              }
              if(scenarios[0]) {
                match_view.candidate_scenario_name=scenarios[0].name;
              }
                match_view.scenario_name = match_view.job_scenario_name;
              break;
            }
          }
          if(isFound) {
            break;
          }
        }
        for (let capability of role.default_complexities) {
          for (let complexity of capability.complexities) {
            let custom_code = capability.code + '_' + complexity.code;
            if (custom_code === cap) {
              isFound = true;
              let scenarios = complexity.scenarios.filter((sce: ScenarioModel) => {
                sce.code =sce.code.replace('.','_');
                sce.code =sce.code.replace('.','_');
                sce.code = sce.code.substr(sce.code.lastIndexOf('_')+1);
                if(sce.code == newCandidate.capability_matrix[cap])  {
                  return true;
                }else {
                  return false;
                }
              });
              let job_scenarios = complexity.scenarios.filter((sce: ScenarioModel) => {
                sce.code =sce.code.replace('.','_');
                sce.code =sce.code.replace('.','_');
                sce.code = sce.code.substr(sce.code.lastIndexOf('_')+1);
                if(sce.code == job.capability_matrix[cap])  {
                  return true;
                }else {
                  return false;
                }
              });
              match_view.capability_name = capability.name;
              match_view.complexity_name = complexity.name;
              if(job_scenarios[0]){
                match_view.job_scenario_name=job_scenarios[0].name;
              }
              if(scenarios[0]) {
                match_view.candidate_scenario_name=scenarios[0].name;
              }
                match_view.scenario_name = match_view.job_scenario_name;
              break;
            }
          }
          if(isFound) {
            break;
          }
        }
        if (isFound) {
          break;
        }
      }
      if (match_view.capability_name != undefined) {
        newCandidate['match_map'][cap] = match_view;
      }

    }
    return newCandidate;
  }

  getMultiCompareResult(candidate: any, jobId: string, recruiterId:any, isCandidate: boolean, callback: (error: any, result: any) => void) {

    this.candidateRepository.retrieveByMultiIdsAndPopulate(candidate, {}, (err: any, candidateRes: any) => {
      if (err) {
        callback(err, null);
      } else {
        if (candidateRes.length > 0) {
          let data = {
            'postedJob': jobId
          };
          let jobProfileService: JobProfileService = new JobProfileService();
          jobProfileService.retrieve(data, (errInJob, resOfRecruiter) => {
            if (errInJob) {
              callback(errInJob, null);
            } else {
              var jobName = resOfRecruiter.postedJobs[0].industry.name;
              var job = resOfRecruiter.postedJobs[0];
              this.industryRepository.retrieve({'name': jobName}, (err: any, industries: IndustryModel[]) => {
                if (err) {
                  callback(err, null);
                } else {
                  var compareResult: ProfileComparisonDataModel[] = new Array(0);
                  for (let candidate of candidateRes) {
                    var newCandidate = this.getCompareData(candidate, job, isCandidate, industries);
                        newCandidate = this.getListStatusOfCandidate(newCandidate,job);
                        newCandidate = this.sortCandidateSkills(newCandidate);
                    //console.log('----------------data-status---------------',newCandidate);
                    compareResult.push(newCandidate);
                  }
                  let profileComparisonModel:ProfileComparisonModel = new ProfileComparisonModel();
                  profileComparisonModel.profileComparisonData = compareResult;
                  var jobDetails:ProfileComparisonJobModel = this.getJobDetailsForComparison(job);
                  //console.log('----------------------jobDetails-----------------------------------------',jobDetails);

                  profileComparisonModel.profileComparisonJobData = jobDetails;
                  callback(null, profileComparisonModel);
                }
              });
            }
          });
        } else {
          callback(null, 'No Candidate Profile Result Found');
        }
      }
    });
  }

  getJobDetailsForComparison(job:JobProfileModel) {
    var profileComparisonJobModel:ProfileComparisonJobModel = new ProfileComparisonJobModel();
    profileComparisonJobModel.city = job.location.city;
    profileComparisonJobModel.country = job.location.country;
    profileComparisonJobModel.state = job.location.state;
    profileComparisonJobModel.education = job.education;
    profileComparisonJobModel.experienceMaxValue = job.experienceMaxValue;
    profileComparisonJobModel.experienceMinValue = job.experienceMinValue;
    profileComparisonJobModel.industryName = job.industry.name;
    profileComparisonJobModel.jobTitle = job.jobTitle;
    profileComparisonJobModel.joiningPeriod = job.joiningPeriod;
    profileComparisonJobModel.salaryMaxValue = job.salaryMaxValue;
    profileComparisonJobModel.salaryMinValue = job.salaryMinValue;
    profileComparisonJobModel.proficiencies = job.proficiencies;
    profileComparisonJobModel.interestedIndustries = job.interestedIndustries;
    return profileComparisonJobModel;
  }
  getListStatusOfCandidate(newCandidate:ProfileComparisonDataModel,jobProfile:JobProfileModel) {
    var candidateListStatus:string[] = new Array(0);
    for(let list of jobProfile.candidate_list) {
      for(let id of list.ids) {
         if(newCandidate._id == id) {
           candidateListStatus.push(list.name);
         }
      }
    }
    if(candidateListStatus.length == 0) {
      candidateListStatus.push('matchedList');
    }
    newCandidate.candidateListStatus = candidateListStatus;
    return newCandidate;
  }

  sortCandidateSkills(newCandidate:ProfileComparisonDataModel) {

    var skillStatusData:SkillStatus[] = new Array(0);
    for(let value of newCandidate.proficienciesMatch) {
      var skillStatus:SkillStatus = new SkillStatus();
      skillStatus.name = value;
      skillStatus.status = 'Match';
      skillStatusData.push(skillStatus);
      //newCandidate.candidateSkillStatus.push(skillStatus);
    }
    for(let value of newCandidate.proficienciesUnMatch) {
      var skillStatus:SkillStatus = new SkillStatus();
      skillStatus.name = value;
      skillStatus.status = 'UnMatch';
      skillStatusData.push(skillStatus);
      //newCandidate.candidateSkillStatus.push(skillStatus);
    }
    newCandidate.candidateSkillStatus = skillStatusData;
    return newCandidate;
  }
}

Object.seal(SearchService);
export = SearchService;
