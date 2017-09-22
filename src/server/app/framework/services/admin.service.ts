/**
 * Created by techprime002 on 8/28/2017.
 */
import UserRepository = require('../dataaccess/repository/user.repository');
import SendMailService = require('./sendmail.service');
import * as mongoose from "mongoose";
import {Recruiter} from "../dataaccess/model/recruiter-final.model";
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
let usestracking = require('uses-tracking');

class AdminService {
  company_name:string;
  private userRepository:UserRepository;
  private industryRepositiry:IndustryRepository;
  private recruiterRepository:RecruiterRepository;
  private usesTrackingController:any;


  constructor() {
    this.userRepository = new UserRepository();
    this.industryRepositiry = new IndustryRepository();
    this.recruiterRepository = new RecruiterRepository();
    let obj:any = new usestracking.MyController();
    this.usesTrackingController = obj._controller;
  }

  seperateUsers(item:any, callback:(error:any, result:UsersClassModel) => void) {
    try {
      let users:UsersClassModel = new UsersClassModel();
      let candidateService = new CandidateService();
      let candidates:CandidateModelClass[] = new Array(0);
      let recruiters:RecruiterClassModel[] = new Array(0);
      let value = 0;
      for (let i = 0; i < item.length; i++) {
        if (item[i].isCandidate) {
          candidateService.retrieve({'userId': new mongoose.Types.ObjectId(item[i]._id)}, (error, resu) => {
            if (error) {
              callback(error, null);
            } else {
              if (!item[i].isAdmin) {
                this.industryRepositiry.retrieve({'code': resu[0].industry.code}, (error:any, industries:IndustryModel[]) => {
                  if (error) {
                    callback(error, null);
                  } else {
                    value = this.getCandidateDetails(resu, item, i, industries, value, candidates);
                    this.extractedForValueIncrement(value, item, users, candidates, recruiters, callback);
                  }
                });
              }
            }
          });
        }
        else if (!item[i].isCandidate) {

          let recruiterService = new RecruiterService();
          let data = {
              'userId': new mongoose.Types.ObjectId(item[i]._id)
            }
            ;
          recruiterService.retrieve(data, (error: any, result: Recruiter[]) => {
            if (error) {
              callback(error, null);
            } else {

              value++;
              if (!item[i].isAdmin) {
                item[i].data = result[0]
                recruiters.push(item[i]);
                    }
              if (value && item.length === value) {
                users.candidate = candidates;
                users.recruiter = recruiters;
                callback(null, users);
                }
              }
          });
        }
      }
    } catch (e) {
      callback(e, null);
    }
  };

  private extractedForValueIncrement(value:number, item:any, users:UsersClassModel, candidates:CandidateModelClass[], recruiters:RecruiterClassModel[], callback:(error:any, result:any)=>void) {
    if (value && item.length === value) {
      users.candidate = candidates;
      users.recruiter = recruiters;
      callback(null, users);
    }
  }

  private getRecruiterDetails(result:Recruiter[], industries:IndustryModel[], item:any, i:number, recruiters:RecruiterClassModel[]) {
    let recruiterService = new RecruiterService();
    recruiterService.loadCapbilityAndKeySkills(result[0].postedJobs, industries);
    item[i].data = result[0];
    item[i].data.jobCountModel=result[0].jobCountModel;
    recruiters.push(item[i]);
  }

  private getCandidateDetails(resu:any, item:any, i:number, industries:IndustryModel[], value:number, candidates:CandidateModelClass[]) {
    let candidateService = new CandidateService();
    let response:any = candidateService.getCandidateDetail(resu[0], item[i], industries);
    response.personalDetails = {};
    item[i].data = response;
    value++;
    candidates.push(item[i]);
    return value;
  }

  addUsageDetailsValue(item:any, callback:(error:any, result:any) => void) {
    try {
      let value:number = 0;
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

  generateUsageDetailFile(result:any, callback:(err:any, res:any) => void) {
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

  generateCandidateDetailFile(result:any, callback:(err:any, res:any) => void) {
    if (result.candidate && result.candidate.length > 0) {
      let fields = ['first_name', 'last_name', 'mobile_number', 'email', 'isActivated', 'data.location.city', 'data.professionalDetails.education',
        'data.professionalDetails.experience', 'data.professionalDetails.currentSalary', 'data.professionalDetails.noticePeriod',
        'data.professionalDetails.relocate', 'data.professionalDetails.industryExposure', 'data.professionalDetails.currentCompany',
        'data.isCompleted', 'data.isSubmitted', 'data.isVisible', 'data.keySkills', 'data.industry.name', 'data.industry.roles.name',
        'data.capabilities.name', 'data.capabilities.complexities.name', 'data.capabilities.complexities.answer', 'data.industry.roles.default_complexities.name',
        'data.industry.roles.default_complexities.complexities.name', 'data.industry.roles.default_complexities.complexities.scenarios.name'];
      let fieldNames = ['First Name', 'Last Name', 'Mobile Number', 'Email', 'Is Activated', 'Location', 'Education', 'Experience',
        'Current Salary', 'Notice Period', 'Relocate', 'Industry Exposure', 'Current Company', 'Is Completed', 'Is Submitted',
        'Is Visible', 'Key Skills', 'Industry', 'Area of work', 'Capabilities', 'Complexity', 'Scenario', 'Default Complexity', 'Complexities', 'Scenarios'];//
      let csv = json2csv({
        data: result.candidate, fields: fields, fieldNames: fieldNames,
        unwindPath: ['data.industry.roles', 'data.industry.roles.default_complexities', 'data.industry.roles.default_complexities.complexities',
          'data.industry.roles.default_complexities.complexities.scenarios', 'data.capabilities', 'data.capabilities.complexities']
      });
      //fs.writeFile('./src/server/public/candidate.csv', csv, function (err:any) {
      fs.writeFile('/home/bitnami/apps/jobmosis-staging/c-next/dist/prod/server/public/candidate.csv', csv, function (err: any) {
        if (err) throw err;
        callback(null, result);
      });
    } else {
      callback(null, result);
    }
  };

  generateRecruiterDetailFile(result:any, callback:(err:any, res:any) => void) {
    if (result.recruiter && result.recruiter.length > 0) {
      let fields = ['data.company_name', 'data.company_size', 'data.isRecruitingForself', 'data.jobCountModel.numberOfJobposted', 'mobile_number', 'email', 'isActivated', 'data.postedJobs.isJobPosted', 'data.postedJobs.jobTitle', 'data.postedJobs.hiringManager', 'data.postedJobs.department', 'data.postedJobs.education', 'data.postedJobs.experienceMinValue', 'data.postedJobs.experienceMaxValue', 'data.postedJobs.salaryMinValue', 'data.postedJobs.salaryMaxValue', 'data.postedJobs.joiningPeriod', 'data.postedJobs.postingDate', 'data.postedJobs.expiringDate'];
      let fieldNames = ['Company Name', 'company size', 'Recruiting For Self', 'Number of Job Posted', 'Mobile Number', 'Email', 'Is Activated', 'Job Posted', 'Job Title', 'Hiring Manager', 'Department', 'Education', 'Minimum Experience', 'Maximum Experience', 'Minimum Salary', 'Maximum Salary', 'Joining Period', 'Job Posting Date', 'Job Expiry Date'];
      let csv = json2csv({
        data: result.recruiter,
        fields: fields,
        fieldNames: fieldNames,
        unwindPath: ['data.postedJobs']
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

  sendAdminLoginInfoMail(field:any, callback:(error:any, result:any) => void) {
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

  updateUser(_id:string, item:any, callback:(error:any, result:any) => void) {
    this.userRepository.findById(_id, (err:any, res:any) => {
      if (err) {
        callback(err, res);
      } else {
        this.userRepository.update(res._id, item, callback);
      }
    });
  };

  getUsageDetails(field:any, callback:(error:any, result:any) => void) {
    this.usesTrackingController.retrieveAll((err:any, res:any) => {
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
