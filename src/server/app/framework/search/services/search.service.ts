import JobProfileModel = require('../../dataaccess/model/jobprofile.model');
import CandidateRepository = require('../../dataaccess/repository/candidate.repository');
import ProjectAsset = require('../../shared/projectasset');
import RecruiterRepository = require('../../dataaccess/repository/recruiter.repository');
import CandidateModel = require('../../dataaccess/model/candidate.model');
import JobProfileService = require('../../services/jobprofile.service');
import {ConstVariables} from '../../shared/sharedconstants';
import MatchViewModel = require('../../dataaccess/model/match-view.model');
import Match = require('../../dataaccess/model/match-enum');
import IndustryRepository = require('../../dataaccess/repository/industry.repository');
import IndustryModel = require('../../dataaccess/model/industry.model');
import ScenarioModel = require('../../dataaccess/model/scenario.model');

class SearchService {
  APP_NAME: string;
  candidateRepository: CandidateRepository;
  recruiterRepository: RecruiterRepository;
  industryRepository: IndustryRepository;

  constructor() {
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.candidateRepository = new CandidateRepository();
    this.recruiterRepository = new RecruiterRepository();
    this.industryRepository = new IndustryRepository();
  }

  getMatchingCandidates(jobProfile: JobProfileModel, callback: (error: any, result: any) => void) {
    console.time('getMatching Candidate');
    let data: any;
    let isFound: boolean = false;
    if (jobProfile.interestedIndustries && jobProfile.interestedIndustries.length > 0) {
      /*isFound= jobProfile.interestedIndustries.filter((name : string)=> {
       if(name === 'None'){
       return name;
       }
       });*/
      for (let name of jobProfile.interestedIndustries) {
        if (name === 'None') {
          isFound = true;
        }
      }
      if (isFound) {
        data = {
          'industry.name': jobProfile.industry.name,
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
          'interestedIndustries': {$in: jobProfile.interestedIndustries},
          'isVisible': true,
        };
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
        console.timeEnd('getMatching Candidate');
        // callback(null, res);
        this.candidateRepository.getCandidateQCard(res, jobProfile, undefined, callback);
      }
    });
  }

  getMatchingJobProfile(candidate: CandidateModel, callback: (error: any, result: any) => void) {

    let data = {
      'postedJobs.industry.name': candidate.industry.name,
      'postedJobs.proficiencies': {$in: candidate.proficiencies},
      'postedJobs.interestedIndustries': {$in: candidate.interestedIndustries}
    };
    let excluded_fields = {
      'postedJobs.industry': 0,
    };
    this.recruiterRepository.retrieveWithLean(data,excluded_fields, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        this.recruiterRepository.getJobProfileQCard(res, candidate, undefined, callback);
      }
    });
  }

  getMatchingResult(candidateId: string, jobId: string, isCandidate : boolean,callback: (error: any, result: any) => void) {
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
        let newCandidate = candidate.toObject();
        let jobMinExperience: number = Number(job.experienceMinValue);
        let jobMaxExperience: number = Number(job.experienceMaxValue);
        let jobMinSalary: number = Number(job.salaryMinValue);
        let jobMaxSalary: number = Number(job.salaryMaxValue);
        let candiExperience: string[] = newCandidate.professionalDetails.experience.split(' ');
        let canSalary: string[] =  newCandidate.professionalDetails.currentSalary.split(' ');
        if((jobMaxExperience >= Number(candiExperience[0])) && (jobMinExperience <= Number(candiExperience[0]))){
          newCandidate.experienceMatch ='exact';
        }else {
          newCandidate.experienceMatch ='missing';
        }
        if((jobMaxSalary >= Number(canSalary[0])) && (jobMinSalary <= Number(canSalary[0]))){
          newCandidate.salaryMatch ='exact';
        }else {
          newCandidate.salaryMatch ='missing';
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
        newCandidate['match_map'] = {};
        newCandidate = this.buildCompareView(job,newCandidate,industries,isCandidate);
        newCandidate = this.getAdditionalCapabilities(job, newCandidate, industries);
        callback(null, newCandidate);
      }
    });
  }

  getAdditionalCapabilities(job : any, newCandidate : any , industries : any) : any {
    newCandidate.additionalCapabilites = new Array(0);
    for (let cap in newCandidate.capability_matrix) {
        let isFound: boolean= false;
        for(let jobCap in job.capability_matrix) {
            if(cap.substr(0,cap.indexOf('_')) === jobCap.substr(0,jobCap.indexOf('_'))){
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
      if (job.capability_matrix[cap] == -1 || job.capability_matrix[cap] == 0 || job.capability_matrix[cap] == undefined) {
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
              if(isCandidate) {
                match_view.scenario_name = match_view.candidate_scenario_name;
              }else {
                match_view.scenario_name = match_view.job_scenario_name;
              }
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
              if(isCandidate) {
                console.log("in isCandidate");
                match_view.scenario_name = match_view.candidate_scenario_name;
              }else {
                console.log("in Not isCandidate");
                match_view.scenario_name = match_view.job_scenario_name;
              }
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
      newCandidate['match_map'][cap]= match_view;
    }
    return newCandidate;
  }

}

Object.seal(SearchService);
export = SearchService;
