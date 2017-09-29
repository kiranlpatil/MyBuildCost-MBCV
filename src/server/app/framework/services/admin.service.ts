/**
 * Created by techprime002 on 8/28/2017.
 */
import UserRepository = require('../dataaccess/repository/user.repository');
import SendMailService = require('./sendmail.service');
import * as mongoose from "mongoose";
import {ConstVariables} from "../shared/sharedconstants";
let config = require('config');
let json2csv = require('json2csv');
let fs = require('fs');
import Messages = require('../shared/messages');
import MailAttachments = require('../shared/sharedarray');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');
import UsersClassModel = require('../dataaccess/model/users');
import CandidateService = require('./candidate.service');
import RecruiterService = require('./recruiter.service');
import IndustryModel = require('../dataaccess/model/industry.model');
import IndustryRepository = require('../dataaccess/repository/industry.repository');
import CandidateModelClass = require('../dataaccess/model/candidateClass.model');
import RecruiterClassModel = require('../dataaccess/model/recruiterClass.model');
import CandidateClassModel = require('../dataaccess/model/candidate-class.model');
import UserService = require("./user.service");
let usestracking = require('uses-tracking');

class AdminService {
  company_name: string;
  private userRepository: UserRepository;
  private industryRepositiry: IndustryRepository;
  private recruiterRepository: RecruiterRepository;
  private usesTrackingController: any;


  constructor() {
    this.userRepository = new UserRepository();
    this.industryRepositiry = new IndustryRepository();
    this.recruiterRepository = new RecruiterRepository();
    let obj: any = new usestracking.MyController();
    this.usesTrackingController = obj._controller;
  }

  getUserDetails(userType: string, callback: (error: any, result: UsersClassModel) => void) {
    try {
      let userService = new UserService();
      let candidateService = new CandidateService();
      let recruiterService = new RecruiterService();
      let users: UsersClassModel = new UsersClassModel();
      let findQuery = new Object();

      if (userType == 'candidate') {
        findQuery = {'isCandidate': true};
      } else {
        findQuery = {'isCandidate': false};
      }

      let included_fields = {
        '_id': 1,
        'first_name': 1,
        'last_name': 1,
        'mobile_number': 1,
        'email': 1,
        'isCandidate': 1,
        'isAdmin': 1,
        'isActivated': 1
      };
      let sortingQuery = {'first_name': 1, 'last_name': 1};

      userService.retrieveBySortedOrder(findQuery, included_fields, sortingQuery, (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          if (result.length == 0) {
            callback(null, users);
          }
          else {
            let value = 0;
            if (userType == 'candidate') {
              let candidates: CandidateModelClass[] = new Array(0);
              let candidateFields = {
                '_id': 1,
                'jobTitle': 1,
                'isCompleted': 1,
                'isSubmitted': 1,
                'location': 1,
                'proficiencies': 1,
                'professionalDetails': 1,
                'capability_matrix': 1,
                'isVisible': 1,
                'industry.name': 1
              };
              for (let i = 0; i < result.length; i++) {
                if (result[i].isCandidate) {
                  candidateService.retrieveWithLean({'userId': new mongoose.Types.ObjectId(result[i]._id)}, candidateFields, (error, resu) => {
                    if (error) {
                      callback(error, null);
                    } else {
                      value++;
                      if (!result[i].isAdmin) {
                        resu[0].keySkills = resu[0].proficiencies.toString().replace(/,/g, ' $');
                        resu[0].capabilityMatrix = candidateService.loadCapabilitiDetails(resu[0].capability_matrix);
                        result[i].data = resu[0];
                        candidates.push(result[i]);
                        if (value && result.length === value) {
                          users.candidate = candidates;
                          console.log("fetch all records" + value);
                          callback(null, users);
                        }
                      }
                    }
                  });
                }
              }
            } else {
              console.log("inside recruiter fetch");
              let recruiters: RecruiterClassModel[] = new Array(0);
              let findQuery = {};
              let recruiterFields = {
                '_id': 1,
                'company_name': 1,
                'company_size': 1,
                'isRecruitingForself': 1,
                'postedJobs': 1
              };
              let sortingQuery = {'company_name': 1, 'company_size': 1};

              for (let i = 0; i < result.length; i++) {
                if (!result[i].isCandidate) {
                  recruiterService.retrieveWithLean({'userId': new mongoose.Types.ObjectId(result[i]._id)}, recruiterFields, (error, resu) => {
                    if (error) {
                      callback(error, null);
                    } else {
                      value++;
                      if (!result[i].isAdmin) {
                        resu[0].numberOfJobsPosted = resu[0].postedJobs.length;
                        //resu[0].posted_jobs = recruiterService.loadCapbilityAndKeySkills(resu[0].postedJobs);
                        recruiterService.loadCapbilityAndKeySkills(resu[0].postedJobs);
                        result[i].data = resu[0];
                        recruiters.push(result[i]);
                        if (value && result.length === value) {
                          users.recruiter = recruiters;
                          console.log("fetch all records" + value);
                          callback(null, users);
                        }
                      }
                    }
                  });
                }
              }
            }
          }

        }
      });
    } catch
      (e) {
      callback(e, null);
    }
  };

  getRecruiterDetails(initial: string, callback: (error: any, result: any) => void) {
    try {
      let userService = new UserService();
      let recruiterService = new RecruiterService();
      let users: UsersClassModel = new UsersClassModel();
      let recruiters: RecruiterClassModel[] = new Array(0);

      let regEx = new RegExp('^[' + initial.toLowerCase() + initial.toUpperCase() + ']');
      let findQuery = {
        'company_name': {
          $regex: regEx
        }
      }
      let sortingQuery = {'company_name': 1, 'company_size': 1};

      let recruiterFields = {
        '_id': 1,
        'userId': 1,
        'company_name': 1,
        'company_size': 1,
        'isRecruitingForself': 1,
        'postedJobs': 1
      };

      recruiterService.retrieveBySortedOrder(findQuery, recruiterFields, sortingQuery, (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          if (result.length == 0) {
            callback(null, users);
          }
          else {
            let value = 0;
            for (let i = 0; i < result.length; i++) {
              userService.retrieveWithLean({'_id': new mongoose.Types.ObjectId(result[i].userId)}, (error, resu) => {
                if (error) {
                  callback(error, null);
                } else {
                  console.log("inside else");
                  value++;
                  resu[0].data = result[i];
                  recruiters.push(resu[0]);
                  if (value && result.length == value) {
                    users.recruiter = recruiters;
                    callback(null, users);
                  }
                }
              });
            }
          }
        }
      });
    }
    catch
      (e) {
      callback(e, null);
    }
  }

  /*private getRecruiterDetails(result: Recruiter[], industries: IndustryModel[], item: any, i: number, recruiters: RecruiterClassModel[]) {
   let recruiterService = new RecruiterService();
   recruiterService.loadCapbilityAndKeySkills(result[0].postedJobs, industries);
   item[i].data = result[0];
   item[i].data.jobCountModel = result[0].jobCountModel;
   recruiters.push(item[i]);
   }*/

  getCandidateDetails(initial: string, callback: (error: any, result: any) => void) {
    try {
      let userService = new UserService();
      let candidateService = new CandidateService();
      let users: UsersClassModel = new UsersClassModel();
      let candidates: CandidateModelClass[] = new Array(0);

      let regEx = new RegExp('^' + initial);
      let findQuery = {
        'first_name': {
          $regex: regEx
        }
      };

      let included_fields = {
        '_id': 1,
        'first_name': 1,
        'last_name': 1,
        'mobile_number': 1,
        'email': 1,
        'isCandidate': 1,
        'isAdmin': 1,
        'isActivated': 1
      };
      let sortingQuery = {'first_name': 1, 'last_name': 1};

      userService.retrieveBySortedOrder(findQuery, included_fields, sortingQuery, (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          if (result.length == 0) {
            callback(null, users);
          }
          else {
            let value = 0;
            let candidateFields = {
              '_id': 1,
              'jobTitle': 1,
              'isCompleted': 1,
              'isSubmitted': 1,
              'location': 1
            };
            for (let i = 0; i < result.length; i++) {
              if (result[i].isCandidate) {
                candidateService.retrieveWithLean({'userId': new mongoose.Types.ObjectId(result[i]._id)}, candidateFields, (error, resu) => {
                  if (error) {
                    callback(error, null);
                  } else {
                    value++;
                    if (!result[i].isAdmin) {
                      result[i].data = resu[0];
                      candidates.push(result[i]);
                      if (value && result.length === value) {
                        users.candidate = candidates;
                        callback(null, users);
                      }
                    }
                  }
                });
              }
            }
          }

        }
      });
    } catch (e) {
      callback(e, null);
    }
  }

  addUsageDetailsValue(item: any, callback: (error: any, result: any) => void) {
    try {
      let value: number = 0;
      for (let i = 0; i < item.length; i++) {
        value++;
        item[i].action = ConstVariables.ActionsArray[item[i].action];
        if (item.length === value) {
          callback(null, item);
        }
      }
    } catch (e) {
      callback(e, null);
    }
  };

  generateUsageDetailFile(result: any, callback: (err: any, res: any) => void) {
    if (result && result.length > 0) {
      let fields = ['candidateId', 'recruiterId', 'jobProfileId', 'action', 'timestamp'];
      let fieldNames = ['Candidate Id', 'RecruiterId', 'Job Profile Id', 'Action', 'TimeStamp'];
      let csv = json2csv({data: result, fields: fields, fieldNames: fieldNames});
      //fs.writeFile('./src/server/public/usagedetail.csv', csv, function (err: any) {
      fs.writeFile('/home/bitnami/apps/jobmosis-staging/c-next/dist/prod/server/public/usagedetail.csv', csv, function (err: any) {
        if (err) throw err;
        callback(null, result);
      });
    } else {
      callback(null, result);
    }
  };

  generateCandidateDetailFile(result: any, callback: (err: any, res: any) => void) {
    console.log("inside generate file");
    if (result.candidate && result.candidate.length > 0) {
      let fields = ['first_name', 'last_name', 'mobile_number', 'email', 'isActivated', 'data.location.city',
        'data.professionalDetails.education', 'data.professionalDetails.experience',
        'data.professionalDetails.currentSalary', 'data.professionalDetails.noticePeriod',
        'data.professionalDetails.relocate', 'data.professionalDetails.industryExposure',
        'data.professionalDetails.currentCompany', 'data.isCompleted', 'data.isSubmitted', 'data.isVisible',
        'data.industry.name', 'data.keySkills', 'data.capabilityMatrix.capabilityCode',
        'data.capabilityMatrix.complexityCode', 'data.capabilityMatrix.scenerioCode'];
      let fieldNames = ['First Name', 'Last Name', 'Mobile Number', 'Email', 'Is Activated', 'City', 'Education',
        'Experience', 'Current Salary', 'Notice Period', 'Ready To Relocate', 'Industry Exposure', 'Current Company',
        'Is Completed', 'Is Submitted', 'Is Visible', 'Industry Name', 'Key Skills', 'Capability Code',
        'Complexity Code', 'Scenario Code'];//

      let csv = json2csv({
        data: result.candidate, fields: fields, fieldNames: fieldNames,
        unwindPath: ['data.capabilityMatrix']
      });
      console.log("writing into file file");
      //fs.writeFile('./src/server/public/candidate.csv', csv, function (err: any) {
        fs.writeFile('/home/bitnami/apps/jobmosis-staging/c-next/dist/prod/server/public/candidate.csv', csv, function (err: any) {
        if (err) throw err;
        callback(null, result);
      });
    } else {
      callback(null, result);
    }
  };

  generateRecruiterDetailFile(result: any, callback: (err: any, res: any) => void) {
    console.log("inside generate file");
    if (result.recruiter && result.recruiter.length > 0) {
      let fields = ['data.company_name', 'data.company_size', 'data.isRecruitingForself',
        'data.numberOfJobsPosted', 'mobile_number', 'email', 'isActivated', 'data.postedJobs.isJobPosted',
        'data.postedJobs.jobTitle', 'data.postedJobs.hiringManager', 'data.postedJobs.department',
        'data.postedJobs.education', 'data.postedJobs.experienceMinValue', 'data.postedJobs.experienceMaxValue',
        'data.postedJobs.salaryMinValue', 'data.postedJobs.salaryMaxValue', 'data.postedJobs.joiningPeriod',
        'data.postedJobs.keySkills', 'data.postedJobs.additionalKeySkills', 'data.postedJobs.capabilityMatrix.capabilityCode',
        'data.postedJobs.capabilityMatrix.complexityCode', 'data.postedJobs.capabilityMatrix.scenerioCode',
        'data.postedJobs.postingDate', 'data.postedJobs.expiringDate'];

      let fieldNames = ['Company Name', 'company size', 'Recruiting For Self', 'Number of Job Posted', 'Mobile Number',
        'Email', 'Is Activated', 'Is Job Posted', 'Job Title', 'Hiring Manager', 'Department', 'Education',
        'Experience MinValue', 'Experience MaxValue', 'Salary MinValue', 'Salary MaxValue', 'Joining Period',
        'Key Skills', 'Additional Key Skills', 'Capability Code',
        'Complexity Code', 'Scenario Code', 'Posting Date', 'Expiring Date'];
      let csv = json2csv({
        data: result.recruiter,
        fields: fields,
        fieldNames: fieldNames,
        unwindPath: ['data.postedJobs', 'data.postedJobs.capabilityMatrix']
      });
      //fs.writeFile('./src/server/public/recruiter.csv', csv, function (err: any) {
        fs.writeFile('/home/bitnami/apps/jobmosis-staging/c-next/dist/prod/server/public/recruiter.csv', csv, function (err: any) {
        if (err) throw err;
        callback(null, result);
      });
    } else {
      callback(null, result);
    }
  };

  sendAdminLoginInfoMail(field: any, callback: (error: any, result: any) => void) {
    let header1 = fs.readFileSync('./src/server/app/framework/public/header1.html').toString();
    let content = fs.readFileSync('./src/server/app/framework/public/adminlogininfo.mail.html').toString();
    let footer1 = fs.readFileSync('./src/server/app/framework/public/footer1.html').toString();
    let mid_content = content.replace('$email$', field.email).replace('$address$', (field.location === undefined) ? 'Not Found' : field.location)
      .replace('$ip$', field.ip).replace('$host$', config.get('TplSeed.mail.host'));


    let mailOptions = {
      from: config.get('TplSeed.mail.MAIL_SENDER'),
      to: config.get('TplSeed.mail.ADMIN_MAIL'),
      cc: config.get('TplSeed.mail.TPLGROUP_MAIL'),
      subject: Messages.EMAIL_SUBJECT_ADMIN_LOGGED_ON + " " + config.get('TplSeed.mail.host'),
      html: header1 + mid_content + footer1
      , attachments: MailAttachments.AttachmentArray
    }
    let sendMailService = new SendMailService();
    sendMailService.sendMail(mailOptions, callback);

  };

  updateUser(_id: string, item: any, callback: (error: any, result: any) => void) {
    this.userRepository.findById(_id, (err: any, res: any) => {
      if (err) {
        callback(err, res);
      } else {
        this.userRepository.update(res._id, item, callback);
      }
    });
  };

  getUsageDetails(field: any, callback: (error: any, result: any) => void) {
    this.usesTrackingController.retrieveAll((err: any, res: any) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res);
      }
    });

  }
}

Object.seal(AdminService);
export = AdminService;
