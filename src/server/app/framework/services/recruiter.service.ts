import * as mongoose from "mongoose";
import {Actions, ConstVariables} from "../shared/sharedconstants";
import {JobCountModel} from "../dataaccess/model/job-count.model";
import {CandidatesInLists} from "../dataaccess/model/CandidatesInLists.model";
import {SentMessageInfo} from "nodemailer";
import {Share} from "../../../../client/app/cnext/framework/model/share";
import {RecruiterCandidatesService} from "./recruiter-candidates.service";
import * as sharedService from "../shared/logger/shared.service";
import Messages = require('../shared/messages');
import UserRepository = require('../dataaccess/repository/user.repository');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');
import JobProfileModel = require('../dataaccess/model/jobprofile.model');
import CandidateRepository = require('../dataaccess/repository/candidate.repository');

let config = require('config');
let path = require('path');
import CapabilityMatrixService = require('./capbility-matrix.builder');
import IndustryModel = require('../dataaccess/model/industry.model');
import IndustryRepository = require('../dataaccess/repository/industry.repository');
import MailAttachments = require('../shared/sharedarray');
import SendMailService = require('./mailer.service');
import RecruiterModel = require('../dataaccess/model/recruiter.model');
import RecruiterClassModel = require('../dataaccess/model/recruiterClass.model');
import CandidateService = require('./candidate.service');
import JobProfileRepository = require('../dataaccess/repository/job-profile.repository');
import IJobProfile = require('../dataaccess/mongoose/job-profile');
import IRecruiter = require('../dataaccess/mongoose/recruiter');
import UsageTrackingService = require('./usage-tracking.service');
import AuthInterceptor = require('../interceptor/auth.interceptor');
import ShareService = require('../share/services/share.service');
import RecruiterCandidatesModel = require("../dataaccess/model/recruiter-candidate.model");
import CandidateClassModel = require("../dataaccess/model/candidate-class.model");
import LoggerService = require("../shared/logger/LoggerService");

var bcrypt = require('bcrypt');

class RecruiterService {
  APP_NAME: string;
  private recruiterRepository: RecruiterRepository;
  private candidateRepository: CandidateRepository;
  private userRepository: UserRepository;
  private jobProfileRepository: JobProfileRepository;
  private industryRepository: IndustryRepository;
  private loggerService: LoggerService;

  constructor() {
    this.loggerService = new LoggerService('RECRUITER_SERVICE_ERROR_HANDLER');
    this.recruiterRepository = new RecruiterRepository();
    this.userRepository = new UserRepository();
    this.jobProfileRepository = new JobProfileRepository();
    this.industryRepository = new IndustryRepository();
    this.candidateRepository = new CandidateRepository();
  }

  createUser(item: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieve({'email': item.email}, (err, res) => {
      if (err) {
        callback(new Error(err), null);
      } else if (res.length > 0) {
        if (res[0].isActivated === true) {
          callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
        } else if (res[0].isActivated === false) {
          callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
        }
      } else {
        item.isActivated = false;
        item.isCandidate = false;
        item.created_date = new Date();
        const saltRounds = 10;
        bcrypt.hash(item.password, saltRounds, (err: any, hash: any) => {
          if (err) {
            callback(new Error(Messages.MSG_ERROR_BCRYPT_CREATION), null);
          } else {
            item.password = hash;
            this.userRepository.create(item, (err, res) => {
              if (err) {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
              } else {
                let userId1 = res._id;
                let newItem: any = {
                  isRecruitingForself: item.isRecruitingForself,
                  company_name: item.company_name,
                  company_size: item.company_size,
                  company_logo: item.company_logo,
                  company_website: item.company_website,
                  userId: userId1
                };
                this.recruiterRepository.create(newItem, (err: any, res: any) => {
                  if (err) {
                    callback(err, null);
                  } else {
                    callback(null, res);
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  retrieve(query: any, callback: (err: any, res: IRecruiter[]) => void) {
    this.recruiterRepository.retrieve(query, (error: Error, result: IRecruiter[]) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, result);
      }
    });
  }

  findOneAndUpdate(query: any, newData: any, options: any, callback: (error: any, result: any) => void) {
    this.recruiterRepository.findOneAndUpdate(query, newData, options, callback);
  }

  getJobsByRecruiterId(id: string, callback: (err: Error, res: IJobProfile[]) => void) {
    let query = {'recruiterId': new mongoose.Types.ObjectId(id)};
    let projection = {
      '_id': 1,
      'recruiterId': 1,
      'postingDate': 1,
      'jobTitle': 1,
      'isJobShared': 1,
      'isJobPosted': 1,
      'isJobPostExpired': 1,
      'isJobPostClosed': 1,
      'hiringManager': 1,
      'hideCompanyName': 1,
      'expiringDate': 1,
      'department': 1,
      'daysRemainingForExpiring': 1,
      'candidate_list': 1
    };
    this.jobProfileRepository.retrieveWithoutPopulate(query, projection, (error: Error, jobs: IJobProfile[]) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, jobs);
    });
  }

  getJobsByRecruiterIdAndItsCount(id: string, callback: (err: Error, res: any) => void) {
    this.getJobsByRecruiterId(id, (error: Error, jobs: IJobProfile[]) => {
      if (error) {
        callback(error, null);
        return;
      }
      let jobWithCount: any = {
        jobs: jobs
      };
      jobWithCount.jobCountModel = new JobCountModel();

      for (let job of jobs) {
        job.numberOfCandidatesInList = new CandidatesInLists();
        for (let list of job.candidate_list) {
          switch (list.name) {
            case ConstVariables.APPLIED_CANDIDATE :
              jobWithCount.jobCountModel.totalNumberOfCandidatesApplied += list.ids.length;
              job.numberOfCandidatesInList.applied = list.ids.length;
              break;
            case ConstVariables.CART_LISTED_CANDIDATE :
              job.numberOfCandidatesInList.cart = list.ids.length;
              jobWithCount.jobCountModel.totalNumberOfCandidateInCart += list.ids.length;
              break;
            case ConstVariables.REJECTED_LISTED_CANDIDATE :
              job.numberOfCandidatesInList.rejected = list.ids.length;
              jobWithCount.jobCountModel.totalNumberOfCandidatesRejected += list.ids.length;
              break;
            default :
              break;
          }
        }
        if (!job.numberOfCandidatesInList) {
          job.numberOfCandidatesInList = new CandidatesInLists();
        }
      }
      callback(null, jobWithCount);
    });
  }

  //Todo change with candidate_id now it is a user_id operation
  addJob(_id: string, job: IJobProfile, callback: (error: any, result: any) => void) {
    this.jobProfileRepository.create(job, (err: Error, res: IJobProfile) => {
      if (err) {
        callback(err, null);
      } else {
        this.recruiterRepository.findOneAndUpdate({'userId': new mongoose.Types.ObjectId(_id)},
          {$push: {postedJobs: res._id}},
          {
            'new': true,
          }, (err: Error, response: any) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, res);
            }
          });
      }
    });
  }

  //Todo change with candidate_id now it is a user_id operation
  addCloneJob(_id: string, job: IJobProfile, callback: (error: any, result: any) => void) {
    this.jobProfileRepository.create(job, (err: Error, res: IJobProfile) => {
      if (err) {
        callback(err, null);
      } else {
        /*this.recruiterRepository.findOneAndUpdate({'_id': new mongoose.Types.ObjectId(_id)},
         {$push: {postedJobs: res._id}},
         {
         'new': true,
         },(err, response) => {
         if (err) {
         callback(err,null);
         } else {
         callback(null, response);
         }
         });*/
        callback(null, res);
      }
    });
  }

//Todo change with candidate_id now it is a user_id operation
  updateJob(_id: string, job: IJobProfile, callback: (error: any, result: any) => void) {

    let capabilityMatrixService: CapabilityMatrixService = new CapabilityMatrixService();
    this.industryRepository.retrieve({'name': job.industry.name}, (error: any, industries: IndustryModel[]) => {
      if (error) {
        callback(error, null);
      } else {
        if (job.capability_matrix === undefined) {
          job.capability_matrix = {};
        }
        let new_capability_matrix: any = {};
        let new_complexity_musthave_matrix: any = {};
        job.capability_matrix = capabilityMatrixService.getCapabilityMatrix(job, industries,
          new_capability_matrix);
        job.complexity_musthave_matrix = capabilityMatrixService.getComplexityMustHaveMatrix(job,
          industries, new_complexity_musthave_matrix);
        let query = {
          '_id': new mongoose.Types.ObjectId(job._id)
        };
        this.jobProfileRepository.updateWithQuery(query, job, {new: true}, (err: Error, record: IJobProfile) => {
          if (record) {
            callback(null, record);
          } else {
            let error: any;
            if (record === null) {
              error = new Error('Unable to update posted job maybe recruiter & job post not found. ');
              callback(error, null);
            } else {
              callback(err, null);
            }
          }
        });
      }
    });
  }

  findById(id: any, callback: (error: any, result: any) => void) {
    this.recruiterRepository.findById(id, callback);
  }

  getList(item: any, callback: (error: any, result: any) => void) {
    console.log('remove this code also');
  }

  updateDetails(_id: string, item: any, callback: (error: any, result: any) => void) {

    this.recruiterRepository.retrieve({'userId': new mongoose.Types.ObjectId(_id)}, (err, res) => {

      if (err) {
        callback(err, res);
      } else {
        this.recruiterRepository.findOneAndUpdate({'_id': res[0]._id}, item, {'new': true}, callback);
      }
    });
  }

  loadCapbilityAndKeySkills(postedJob: JobProfileModel[]) {
    let candidateService = new CandidateService();
    for (let i = 0; i < postedJob.length; i++) {
      if (postedJob[i].proficiencies.length > 0) {
        postedJob[i].keySkills = postedJob[i].proficiencies.toString().replace(/,/g, ' $');
      }
      if (postedJob[i].additionalProficiencies.length > 0) {
        postedJob[i].additionalKeySkills = postedJob[i].additionalProficiencies.toString().replace(/,/g, ' $');
      }
      if (postedJob[i].capability_matrix) {
        postedJob[i].capabilityMatrix = candidateService.loadCapabilitiDetails(postedJob[i].capability_matrix);
      }

      if (postedJob[i].industry.roles.length > 0) {
        postedJob[i].roles = candidateService.loadRoles(postedJob[i].industry.roles);
      }

    }
    return postedJob;
  }

  retrieveBySortedOrder(query: any, projection: any, sortingQuery: any, callback: (error: any, result: any) => void) {
    this.recruiterRepository.retrieveBySortedOrder(query, projection, sortingQuery, callback);
  }

  retrieveWithLean(field: any, projection: any, callback: (error: any, result: any) => void) {
    this.recruiterRepository.retrieveWithLean(field, projection, callback);
  }

  notifyRecruiter(field: any, result: any) {
    let sendMailService = new SendMailService();
    let host = config.get('TplSeed.mail.host');
    let link = host + 'signin';
    let data: Map<string, string> = new Map([['$jobmosisLink$', config.get('TplSeed.mail.host')],
      ['$link$', link], ['$mobile_number$', field.mobile_number]]);
    let emailSubject = (result.length) ?
      Messages.EMAIL_SUBJECT_EXISTING_CANDIDATE_REGISTERED_FROM_SITE :
      Messages.EMAIL_SUBJECT_NEW_CANDIDATE_REGISTERED_FROM_SITE;

    this.recruiterRepository.retrieve({'_id': new mongoose.Types.ObjectId(field.recruiterId)},
      (recruiterErr, recData) => {
        if (recruiterErr) {
          this.loggerService.logErrorObj(recruiterErr);
          sharedService.mailToAdmin(recruiterErr);
          return;
        }

        let recruiterCandidatesModel = new RecruiterCandidatesModel();
        recruiterCandidatesModel.recruiterId = field.recruiterId;
        recruiterCandidatesModel.mobileNumber = field.mobile_number;
        recruiterCandidatesModel.source = 'career plugin';
        recruiterCandidatesModel.status = 'Applied';

        if (result.length) {
          this.candidateRepository.retrieve({'userId': new mongoose.Types.ObjectId(result[0]._id)},
            (error: Error, candidate: any) => {
              if (error) {
                this.loggerService.logErrorObj(error);
                sharedService.mailToAdmin(error);
                return;
              }
              recruiterCandidatesModel.name = result[0].first_name + ' ' + result[0].last_name;
              recruiterCandidatesModel.email = result[0].email;
              recruiterCandidatesModel.candidateId = candidate[0]._id.toString();
              this.updateRecruiterCandidates(recruiterCandidatesModel);
            });
        } else {
          this.updateRecruiterCandidates(recruiterCandidatesModel);
        }

        this.userRepository.retrieve({'_id': new mongoose.Types.ObjectId(recData[0].userId)}, (userError, userData) => {
          if (userError) {
            this.loggerService.logErrorObj(userError);
            sharedService.mailToAdmin(userError);
            return;
          }
          sendMailService.send(userData[0].email,
            emailSubject,
            'notify-recruiter.mail.html', data, (emailError: Error, result: any) => {
              if (emailError) {
                this.loggerService.logErrorObj(emailError);
                sharedService.mailToAdmin(emailError);
              }
            });

        });
      });
  }

  updateRecruiterCandidates(recruiterCandidatesModel: RecruiterCandidatesModel) {
    let recruiterCandidatesService = new RecruiterCandidatesService();
    recruiterCandidatesService.update(recruiterCandidatesModel, (error: Error, result: RecruiterCandidatesModel) => {
      if (error) {
        this.loggerService.logErrorObj(error);
        sharedService.mailToAdmin(error);
      }
    });
  }

  sendMailToRecruiter(user: any, field: any, callback: (error: Error, result: SentMessageInfo) => void) {
    let host = config.get('TplSeed.mail.host');
    let link = host + 'signin';
    let sendMailService = new SendMailService();
    let data: Map<string, string> = new Map([['$jobmosisLink$', config.get('TplSeed.mail.host')],
      ['$link$', link], ['$job_title$', field.jobTitle]]);
    sendMailService.send(user.email,
      Messages.EMAIL_SUBJECT_RECRUITER_CONTACTED_YOU + field.jobTitle,
      'confirmation.mail.html', data, callback);
  }

  mailOnRecruiterSignupToAdmin(recruiterBasicInfo: any, companyName: string, callback: (error: Error, result: SentMessageInfo) => void) {
    let link = config.get('TplSeed.mail.host') + 'signin';

    let data: Map<string, string> = new Map([['$jobmosisLink$', config.get('TplSeed.mail.host')],
      ['$company_name$', companyName], ['$email_id$', recruiterBasicInfo.email],
      ['$contact_number$', recruiterBasicInfo.mobile_number], ['$link$', link]]);


    let sendMailService = new SendMailService();
    sendMailService.send(config.get('TplSeed.mail.ADMIN_MAIL'),
      Messages.EMAIL_SUBJECT_RECRUITER_REGISTRATION,
      'recruiter-registration.html', data, (err: Error, result: SentMessageInfo) => {
        callback(err, result);
      });
  }

  notifyOnCandidateJobApply(candidateId: string, job: any, candidateData: any, callback: (error: Error, result: SentMessageInfo) => void) {

    this.candidateRepository.populateCandidateDetails(candidateId, (candidateErr, candidate) => {
      if (candidateErr) {
        callback(candidateErr, null);
        return;
      }
      let config = require('config');
          this.recruiterRepository.populateRecruiterDetails(job.recruiterId, (err, recruiter) => {
            if (err) {
              callback(err, null);
              return;
            }
            let link: any;
            let host: any = config.get('TplSeed.mail.host');
            let actualUrl: string = 'value-portrait' + '/' + candidate._id + ';' + 'jobId='+ job._id;
            link = host + actualUrl;
            let sendMailService = new SendMailService();
            let data: Map<string, string> = new Map([['$jobmosisLink$', config.get('TplSeed.mail.host')],
              ['$link$', link], ['$firstname$', candidate.first_name],
              ['$jobtitle$', job.jobTitle]]);
            sendMailService.send(recruiter.email,
              Messages.EMAIL_SUBJECT_CANDIDATE_APPLIED_FOR_JOB + job.jobTitle,
              'notify-recruiter-on-job-apply.html', data, callback);
        });
    });
  }

  getTotalRecruiterCount(callback: (error: any, result: any) => void) {
    let query = {};
    this.recruiterRepository.getCount(query, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(err, result);
      }
    });
  }

  updateUsageTrackingData(updatedJob: any, job: JobProfileModel, callback: (error: Error) => void) {
    let action: number = 99999;

    if (Boolean(updatedJob._doc.isJobPostClosed) == true) {
      action = Actions.CLOSED_JOB_POST_BY_RECRUITER;
    } else if (job.isJobPostRenew) {
      action = Actions.RENEWED_JOB_POST_BY_RECRUITER;
    } else if (Boolean(updatedJob._doc.isJobPosted) && !Boolean(updatedJob._doc.isJobPostClosed)) {
      action = Actions.POSTED_JOB_BY_RECRUIER;
    } else if (job._id == undefined) {
      action = Actions.CREATED_NEW_JOB_BY_RECRUIER;
    }


    if (action != 99999) {
      let usageTrackingService = new UsageTrackingService();
      usageTrackingService.customCreate(String(updatedJob._doc.recruiterId), String(updatedJob._doc._id), '',
        action, (err) => {
          if (err) {
            callback(err);
          } else {
            callback(null);
          }
        });
    } else {
      callback(null);
    }
  }

}

/*Object.seal(RecruiterService);*/
export = RecruiterService;
