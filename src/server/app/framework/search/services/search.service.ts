import JobProfileModel = require("../../dataaccess/model/jobprofile.model");
import CandidateRepository = require("../../dataaccess/repository/candidate.repository");
import ProjectAsset = require("../../shared/projectasset");
import RecruiterRepository = require("../../dataaccess/repository/recruiter.repository");
import CandidateModel = require("../../dataaccess/model/candidate.model");
import RecruiterModel = require("../../dataaccess/model/recruiter.model");
import CNextMessages = require("../../shared/cnext-messages");
import JobProfileService = require("../../services/jobprofile.service");
import {ConstVariables} from "../../shared/sharedconstants";

class SearchService {
  APP_NAME:string;
  candidateRepository:CandidateRepository;
  recruiterRepository:RecruiterRepository;

  constructor() {
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.candidateRepository = new CandidateRepository();
    this.recruiterRepository = new RecruiterRepository();
  }

  getMatchingCandidates(jobProfile:JobProfileModel, callback:(error:any, result:any) => void) {
    let data:any;
    if (jobProfile.interestedIndustries && jobProfile.interestedIndustries.length > 0) {
      data = {
        "industry.name": jobProfile.industry.name,
        $or: [
          {"professionalDetails.relocate": "Yes"},
          {"location": jobProfile.location}
        ],
        "proficiencies": {$in: jobProfile.proficiencies},
        "interestedIndustries": {$in: jobProfile.interestedIndustries},
        "isVisible": true
      };
    } else {
      data = {
        "industry.name": jobProfile.industry.name,
        $or: [
          {"professionalDetails.relocate": "Yes"},
          {"location": jobProfile.location}
        ],
        "proficiencies": {$in: jobProfile.proficiencies},
        "isVisible": true
      };
    }

    this.candidateRepository.retrieve(data, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        this.candidateRepository.getCandidateQCard(res, jobProfile, undefined, callback);
      }
    });
  }

  getMatchingJobProfile(candidate:CandidateModel, callback:(error:any, result:any) => void) {

    let data = {
      "postedJobs.industry.name": candidate.industry.name,
      "postedJobs.proficiencies": {$in: candidate.proficiencies},
      "postedJobs.interestedIndustries": {$in: candidate.interestedIndustries}
    };
    this.recruiterRepository.retrieve(data, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        this.recruiterRepository.getJobProfileQCard(res, candidate, undefined, callback);
      }
    });
  }

  getMatchingResult(candidateId:string, jobId:string, callback:(error:any, result:any) => void) {
    this.candidateRepository.findById(candidateId, (err:any, candidateRes:any)=> {
      if (err) {
        callback(err, null);
      } else {
        if (candidateRes) {
          let data = {
            "postedJob": jobId
          };
          let jobProfileService:JobProfileService = new JobProfileService();
          jobProfileService.retrieve(data, (errInJob, resOfRecruiter) => {
            if (errInJob) {
              callback(errInJob, null);
            } else {
              this.getResult(candidateRes, resOfRecruiter.postedJobs[0], callback);
            }
          });
        }
      }
    });
  }

  getMatchingResultForJob(candidateId:string, jobId:string, callback:(error:any, result:any) => void) {
    this.candidateRepository.findById(candidateId, (err:any, candidateRes:any)=> {
      if (err) {
        callback(err, null);
      } else {
        if (candidateRes) {
          let data = {
            "postedJob": jobId
          };
          let jobProfileService:JobProfileService = new JobProfileService();
          jobProfileService.retrieve(data, (errInJob, resOfRecruiter) => {
            if (errInJob) {
              callback(errInJob, null);
            } else {
              this.getResultForJob(candidateRes, resOfRecruiter.postedJobs[0], callback);
            }
          });
        }
      }
    });
  }

  compareTwoOptions(first:number, second:number):string {
    if (first < second) {
      return "below";
    } else if (first > second) {
      return "above";
    } else {
      return "exact";
    }
  }

  getEductionSwitchCase(education:string):number {
    switch (education) {
      case "Under Graduate":
        return 1;
      case "Graduate":
        return 2;
      case "Post Graduate":
        return 3;
    }
    return -1;
  }

  getPeriodSwitchCase(period:string):number {
    switch (period) {
      case "Immediate" :
        return 1;
      case "Within 1 month":
        return 2;
      case "1-2 Month":
        return 3;
      case "2-3 Month":
        return 4;
      case "Beyond 3 months":
        return 5;
    }
    return -1;
  }

  getResult(candidate:any, job:any, callback:(error:any, result:any) => void) {
    let newCandidate = candidate.toObject();
    let candiExperience:string[] = newCandidate.professionalDetails.experience.split(" ");
    let jobExperience:string[] = job.experience.split(" ");
    let canSalary:string[] = newCandidate.professionalDetails.currentSalary.split(" ");
    let jobSalary:string[] = job.salary.split(" ");
    newCandidate.experienceMatch = this.compareTwoOptions(Number(candiExperience[0]), Number(jobExperience[0]));
    newCandidate.salaryMatch = this.compareTwoOptions(Number(canSalary[0]), Number(jobSalary[0]));
    let canEducation:number = this.getEductionSwitchCase(newCandidate.professionalDetails.education);
    let jobEducation:number = this.getEductionSwitchCase(job.education);
    newCandidate.educationMatch = this.compareTwoOptions(canEducation, jobEducation);
    newCandidate.releaseMatch = this.compareTwoOptions(this.getPeriodSwitchCase(newCandidate.professionalDetails.noticePeriod), this.getPeriodSwitchCase(job.joiningPeriod));
    newCandidate.interestedIndustryMatch = new Array(0);

    for (let industry of job.interestedIndustries) {
      console.log(industry + "====" + job.interestedIndustries);
      if (newCandidate.interestedIndustries.indexOf(industry) != -1) {
        newCandidate.interestedIndustryMatch.push(industry)
      }
    }
    newCandidate.proficienciesMatch = new Array(0);
    for (let proficiency of job.proficiencies) {
      if (newCandidate.proficiencies.indexOf(proficiency) != -1) {
        newCandidate.proficienciesMatch.push(proficiency);
      }
    }
    for (let jobRole of job.industry.roles) {
      let isRoleFound:boolean = false;
      for (let role of newCandidate.industry.roles) {
        if (jobRole.name == role.name) {
          isRoleFound = true;
          for (let jobCap of jobRole.capabilities) {
            let isCapFound:boolean = false;
            for (let cap of role.capabilities) {
              if (jobCap.name == cap.name) {
                isCapFound = true;
                for (let jobCom of jobCap.complexities) {
                  for (let complexity of cap.complexities) {
                    if (jobCom.name == complexity.name) {
                      let jobSceNum:string;
                      for (let jobScen of jobCom.scenarios) {
                        if (jobScen.isChecked) {
                          jobSceNum = jobScen.code;
                        }
                      }
                      let comNum:string;
                      for (let scenario of complexity.scenarios) {
                        if (scenario.isChecked) {
                          comNum = scenario.code;
                        }
                      }
                      if (jobSceNum.substr(0, jobSceNum.lastIndexOf(".")) == comNum.substr(0, comNum.lastIndexOf("."))) {
                        let job_last_digit:number = Number(jobSceNum.substr(jobSceNum.lastIndexOf(".") + 1));
                        let candi_last_digit:number = Number(comNum.substr(comNum.lastIndexOf(".") + 1));
                        if (job_last_digit == candi_last_digit + ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO) {
                          complexity.match = "above";
                        } else if (job_last_digit == candi_last_digit - ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO) {
                          complexity.match = "below";
                        } else if (job_last_digit == candi_last_digit) {
                          complexity.match = "exact";
                        }
                      }
                      if (complexity.match == undefined) {
                        complexity.match = "missing";
                      }

                    }

                  }
                }
              }

            }
            if (!isCapFound) {
              let newcap = jobCap.toObject();

              for (let jobCompl of jobCap.complexities) {
                jobCompl.match = "extra";
              }
              role.capabilities.push(newcap);
            }
          }
        }
      }
      if (!isRoleFound) {
        let newrole = jobRole.toObject();
        for (let jcap of newrole.capabilities) {
          for (let cm of jcap.complexities) {
            cm.match = "extra";
          }
        }
        newCandidate.industry.roles.push(newrole);
      }
    }
    callback(null, newCandidate);


  }

  getResultForJob(candidate:any, job:any, callback:(error:any, result:any) => void) {
    let newJob = job.toObject();
    let candiExperience:string[] = candidate.professionalDetails.experience.split(" ");
    let jobExperience:string[] = newJob.experience.split(" ");
    let canSalary:string[] = candidate.professionalDetails.currentSalary.split(" ");
    let jobSalary:string[] = newJob.salary.split(" ");
    newJob.experienceMatch = this.compareTwoOptions(Number(candiExperience[0]), Number(jobExperience[0]));
    newJob.salaryMatch = this.compareTwoOptions(Number(canSalary[0]), Number(jobSalary[0]));
    let canEducation:number = this.getEductionSwitchCase(candidate.professionalDetails.education);
    let jobEducation:number = this.getEductionSwitchCase(newJob.education);
    newJob.educationMatch = this.compareTwoOptions(canEducation, jobEducation);
    newJob.releaseMatch = this.compareTwoOptions(this.getPeriodSwitchCase(candidate.professionalDetails.noticePeriod), this.getPeriodSwitchCase(newJob.joiningPeriod));
    newJob.interestedIndustryMatch = new Array(0);

    for (let industry of newJob.interestedIndustries) {
      console.log(industry + "====" + newJob.interestedIndustries);
      if (candidate.interestedIndustries.indexOf(industry) != -1) {
        newJob.interestedIndustryMatch.push(industry)
      }
    }
    newJob.proficienciesMatch = new Array(0);
    for (let proficiency of newJob.proficiencies) {
      if (candidate.proficiencies.indexOf(proficiency) != -1) {
        newJob.proficienciesMatch.push(proficiency);
      }
    }
    for (let role of candidate.industry.roles) {
      let isRoleFound : boolean = false;
      for (let jobRole of newJob.industry.roles) {
        if (jobRole.name == role.name) {
          isRoleFound=true;
          for (let cap of role.capabilities) {
            let isCapFound: boolean=false;
            for (let jobCap of jobRole.capabilities) {
              if (jobCap.name == cap.name) {
                isCapFound = true;
                for (let jobCom of jobCap.complexities) {
                  for (let complexity of cap.complexities) {
                    if (jobCom.name == complexity.name) {
                      let jobSceNum:string;
                      for (let jobScen of jobCom.scenarios) {
                        if (jobScen.isChecked) {
                          jobSceNum = jobScen.code;
                        }
                      }
                      let comNum:string;
                      for (let scenario of complexity.scenarios) {
                        if (scenario.isChecked) {
                          comNum = scenario.code;
                        }
                      }
                      if (jobSceNum.substr(0, jobSceNum.lastIndexOf(".")) == comNum.substr(0, comNum.lastIndexOf("."))) {
                        let job_last_digit:number = Number(jobSceNum.substr(jobSceNum.lastIndexOf(".") + 1));
                        let candi_last_digit:number = Number(comNum.substr(comNum.lastIndexOf(".") + 1));
                        if (job_last_digit == candi_last_digit + ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO) {
                          jobCom.match = "below";
                        } else if (job_last_digit == candi_last_digit - ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO) {
                          jobCom.match = "above";
                        } else if (job_last_digit == candi_last_digit) {
                          jobCom.match = "exact";
                        }
                      }
                      if (jobCom.match == undefined) {
                        jobCom.match = "missing";
                      }

                    }

                  }
                }
              }

            }
            if (!isCapFound) {
              let newcap = cap.toObject();
              for (let jobCompl of newcap.complexities) {
                jobCompl.match = "extra";
              }
              jobRole.capabilities.push(newcap);
            }
          }
        }
      }
      if (!isRoleFound) {
        let newrole = role.toObject();
        for (let ccap of newrole.capabilities) {
          for (let cm of ccap.complexities) {
            cm.match = "extra";
          }
        }
        newJob.industry.roles.push(newrole);
      }
    }
    callback(null, newJob);
  }


}

Object.seal(SearchService);
export = SearchService;
