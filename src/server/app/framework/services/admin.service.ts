/**
 * Created by techprime002 on 8/28/2017.
 */
import * as mongoose from "mongoose";
import UserRepository = require('../dataaccess/repository/user.repository');
import SendMailService = require('./mailer.service');
import Messages = require('../shared/messages');
import MailAttachments = require('../shared/sharedarray');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');
import UsersClassModel = require('../dataaccess/model/users');
import CandidateService = require('./candidate.service');
import RecruiterService = require('./recruiter.service');
import JobProfileService = require('./jobprofile.service');
import IndustryModel = require('../dataaccess/model/industry.model');
import IndustryRepository = require('../dataaccess/repository/industry.repository');
import CandidateModelClass = require('../dataaccess/model/candidateClass.model');
import RecruiterClassModel = require('../dataaccess/model/recruiterClass.model');
import CandidateClassModel = require('../dataaccess/model/candidate-class.model');
import UserService = require('./user.service');
import ExportService = require("./export.service");
import User = require("../dataaccess/mongoose/user");
import RecruiterModel = require("../dataaccess/model/recruiter.model");
let path = require('path');
let config = require('config');
let fs = require('fs');

class AdminService {
  company_name: string;
  private userRepository: UserRepository;
  private industryRepositiry: IndustryRepository;
  private recruiterRepository: RecruiterRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.industryRepositiry = new IndustryRepository();
    this.recruiterRepository = new RecruiterRepository();
  }

  getCountOfUsers(item: any, callback: (error: any, result: any) => void) {
    try {
      let candidateService = new CandidateService();
      let recruiterService = new RecruiterService();
      let users: UsersClassModel = new UsersClassModel();
      let findQuery = new Object();

      candidateService.getTotalCandidateCount((error, candidateCount) => {
        if (error) {
          callback(error, null);
        } else {
          users.totalNumberOfCandidates = candidateCount;
          recruiterService.getTotalRecruiterCount((error, recruiterCount) => {
            if (error) {
              callback(error, null);
            } else {
              users.totalNumberOfRecruiters = recruiterCount;
              callback(null, users);
            }
          });
        }
      });
    } catch
      (e) {
      callback(e, null);
    }
  }

  getRecruiterDetails(initial: string, callback: (error: any, result: any) => void) {
    try {
      let userService = new UserService();
      let users: UsersClassModel = new UsersClassModel();
      let usersMap: Map<any, any> = new Map();
      let recruitersMAP: Map<any, any> = new Map();
      let jobProfileService = new JobProfileService();

      let recruiterService = new RecruiterService();
      let recruiters: any[] = new Array(0);
      let recruiterIdsArray: any[] = new Array(0);

      let regEx = new RegExp('^[' + initial.toLowerCase() + initial.toUpperCase() + ']');
      let findQuery = {
        'company_name': {
          $regex: regEx
        }
      }
      let sortingQuery = {'company_name': 1, 'company_size': 1};

      let recruiterFields = {
        'userId': 1,
        'company_name': 1,
        'company_size': 1,
        'isJobPosted': 1
      };

      recruiterService.retrieveBySortedOrder(findQuery, recruiterFields, sortingQuery, (error, recruiterResult) => {
        if (error) {
          callback(error, null);
        } else {
          users.totalNumberOfRecruiters = recruiterResult.length;
          if (recruiterResult.length === 0) {
            callback(null, users);
          } else {
            let userFields = {
              '_id': 1,
              'mobile_number': 1,
              'email': 1,
              'isActivated': 1
            };

            for (let recruiter of recruiterResult) {
              recruiterIdsArray.push(recruiter._id);
              recruiter.totalNumberOfJobsPosted = 0;
              usersMap.set(recruiter.userId.toString(), recruiter);
            }
            userService.retrieveWithLean({'isCandidate': false}, (error, result) => {
              if (error) {
                callback(error, null);
              } else {
                console.log('Fetched all recruiters from users:' + recruiterResult.length);
                for (let user of result) {
                  if (usersMap.get(user._id.toString())) {
                    user.data = usersMap.get(user._id.toString());
                    recruiters.push(user);
                  }
                }

                for (let rec of recruiters) {
                  recruitersMAP.set(rec.data._id.toString(), rec);
                }

                jobProfileService.retrieveAll({'recruiterId': {$in: recruiterIdsArray}}, (error, jobsResult) => {
                  if (error) {
                    callback(error, null);
                  } else {
                    console.log("Fetched all jobs:" + jobsResult.length);
                    for (let job of jobsResult) {
                      if (recruitersMAP.get(job.recruiterId.toString())) {
                        recruitersMAP.get(job.recruiterId.toString()).data.totalNumberOfJobsPosted =
                          recruitersMAP.get(job.recruiterId.toString()).data.totalNumberOfJobsPosted + 1;
                      }
                    }

                    users.recruiter = recruiters;
                    callback(null, users);
                  }

                });

              }

            });
          }
        }
      });
    } catch
      (e) {
      callback(e, null);
    }
  }

  getCandidateDetails(initial: string, callback: (error: any, result: any) => void) {
    try {
      let userService = new UserService();
      let users: UsersClassModel = new UsersClassModel();
      let usersMap: Map<any, any> = new Map();

      let candidates: CandidateModelClass[] = new Array(0);
      let candidateService = new CandidateService();

      let regEx = new RegExp('^[' + initial.toLowerCase() + initial.toUpperCase() + ']');
      let findQuery = {
        'first_name': {
          $regex: regEx
        },
        'isAdmin': false,
        'isCandidate': true
      };
      let included_fields = {
        '_id': 1,
        'first_name': 1,
        'last_name': 1,
        'mobile_number': 1,
        'email': 1,
        'isActivated': 1
      };
      let sortingQuery = {'first_name': 1, 'last_name': 1};

      userService.retrieveBySortedOrder(findQuery, included_fields, sortingQuery, (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          users.totalNumberOfCandidates = result.length;
          if (result.length === 0) {
            callback(null, users);
          } else {
            let value = 0;
            let candidateFields = {
              'userId': 1,
              'jobTitle': 1,
              'isCompleted': 1,
              'isSubmitted': 1,
              'isVisible': 1,
              'location.city': 1
            };
            candidateService.retrieveWithLean({}, candidateFields, (error, candidatesResult) => {
              if (error) {
                callback(error, null);
              } else {
                console.log('Fetched all candidates:' + candidatesResult.length);
                for (let candidate of candidatesResult) {
                  usersMap.set(candidate.userId.toString(), candidate);
                }

                for (let user of result) {
                  user.data = usersMap.get(user._id.toString());
                  candidates.push(user);
                }

                users.candidate = candidates;
                callback(null, users);

              }
            });
          }

        }
      });
    } catch (e) {
      callback(e, null);
    }
  }

  sendAdminLoginInfoMail(field: any, callback: (error: any, result: any) => void) {
    let sendMailService = new SendMailService();
    let data: Map<string, string> = new Map([['$jobmosisLink$',config.get('TplSeed.mail.host')],
      ['$email$', field.email],
      ['$address$', (field.location === undefined) ? 'Not Found' : field.location],
      ['$ip$', field.ip],
      ['$host$', config.get('TplSeed.mail.host')]]);
    sendMailService.send(config.get('TplSeed.mail.ADMIN_MAIL'),
      Messages.EMAIL_SUBJECT_ADMIN_LOGGED_ON + ' ' + config.get('TplSeed.mail.host'),
      'adminlogininfo.mail.html', data, callback, config.get('TplSeed.mail.TPLGROUP_MAIL'));

  }

  updateUser(_id: string, item: any, callback: (error: any, result: any) => void) {
    if (!item.isCandidate && item.isActivated) {
      item.activation_date = new Date();
    }

    this.userRepository.update(new mongoose.Types.ObjectId(_id), item, (err: Error, data: any) => {
      if (err) {
        callback(err, null);
        return;
      }
      if (!item.isCandidate) {
        this.recruiterRepository.findOneAndUpdate({'userId': new mongoose.Types.ObjectId(_id)},
          {$set: {'api_key': _id}}, {},
          (err: Error, recruiter: RecruiterModel) => {
            if (err) {
              callback(err, null);
              return;
            }
            callback(null, data);
          });
      } else {
        callback(null, data);
      }

    });
  }

}

Object.seal(AdminService);
export = AdminService;
