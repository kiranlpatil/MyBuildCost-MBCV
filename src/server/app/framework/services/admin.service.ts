/**
 * Created by techprime002 on 8/28/2017.
 */
import UserRepository = require("../dataaccess/repository/user.repository");
import UserModel = require("../dataaccess/model/user.model");
import IUserService = require("./user.service");
import SendMailService = require("./sendmail.service");
import SendMessageService = require("./sendmessage.service");
import * as fs from "fs";
import * as mongoose from "mongoose";
//import * as config from 'config';
var config = require('config');
var bcrypt = require('bcrypt');
var json2xls = require('json2xls');
import Messages = require("../shared/messages");
import AuthInterceptor = require("../../framework/interceptor/auth.interceptor");
import ProjectAsset = require("../shared/projectasset");
import MailAttachments = require("../shared/sharedarray");
import RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
import UsersClassModel = require("../dataaccess/model/users");
import CandidateService = require("./candidate.service");
import RecruiterService = require("./recruiter.service");
import CNextMessages = require("../shared/cnext-messages");
import {Recruiter} from "../dataaccess/model/recruiter-final.model";

class AdminService {
  private userRepository: UserRepository;
  private recruiterRepository: RecruiterRepository;
  APP_NAME: string;
  company_name: string;
  mid_content: any;

  constructor() {
    this.userRepository = new UserRepository();
    this.recruiterRepository = new RecruiterRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  seperateUsers(item: any, callback: (error: any, result: any) => void) {
    /*this.userRepository.retrieve(item, (err, res) => {
     if (err) {
     callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
     } else  {
     callback(null, res);
     }
     });*/
    try {
      var users:UsersClassModel = new UsersClassModel;

      let candidateService = new CandidateService();
      var candidates = [];
      var recruiters = [];
      var goNext:boolean = false;
      var value = 0;
      for (let i = 0; i < item.length; i++) {
        if (item[i].isCandidate) {
          candidateService.retrieve({'userId': new mongoose.Types.ObjectId(item[i]._id)}, (error, resu) => {
            if (error) {
              callback(error, null);
            }
            else {
              value++;
              item[i].data = resu[0];
              candidates.push(item[i]);
              if(value && item.length==value){
                users.candidate=candidates;
                users.recruiter=recruiters;
                console.log("call success");
                callback(null, users);
              }
            }
          });

        } else if (!item[i].isCandidate) {

          var recruiterService = new RecruiterService();
          let data = {
            'userId': new mongoose.Types.ObjectId(item[i]._id);
        }
          ;
          recruiterService.retrieve(data, (error:any, result:Recruiter[]) => {
            if (error) {
              callback(error, null);
            } else {
              value++;
              item[i].data = result[0]
              recruiters.push(item[i]);
              if(value && item.length==value){
                users.candidate=candidates;
                users.recruiter=recruiters;
                console.log("call success");
                callback(null, users);
              }
            }
          });
        }
      }
    }catch(e){
      callback(e, null);
    }

  };

  createXlsx(result: any, callback: (err: any, res: any) => void){
    var json2csv = require("json2csv");
    var fs = require('fs');
    if(result.candidate && result.candidate.length>0){
      var fields = ['_id', 'first_name', 'last_name','mobile_number','email','password','current_theme',
        'isCandidate','notifications','otp','isActivated','temp_mobile'];
      var fieldNames = ['User ID', 'First Name', 'Last Name','Mobile Number','Email','Password','Current Theme',
        'Is Candidate','Notifications','Otp','Is Activated','Temp Mobile'];

      var csv = json2csv({ data: result.candidate, fields: fields, fieldNames: fieldNames});
      //unwindPath: ['roles', 'roles.default_complexities','roles.default_complexities.complexities','roles.default_complexities.complexities.scenarios']
      fs.writeFile('./src/server/app/framework/public/admin-data/candidate.csv', csv, function(err:any) {
      //fs.writeFile('E://candidate.csv', csv, function(err:any) {
        if (err) throw err;
        console.log('candidate file saved');
      });
    }
    var recruiterData=result.recruiter;
    if(result.recruiter && result.recruiter.length>0){
      var fields = ['_id','data.company_name','data.jobCountModel.numberOfJobposted','mobile_number','email',
        'isCandidate','isActivated','temp_mobile'];
      var fieldNames = ['User ID','Company Name','Number of Job Posted','Mobile Number','Email',
        'Is Candidate','Is Activated','Temp Mobile'];

      var csv = json2csv({ data: result.recruiter, fields: fields, fieldNames: fieldNames});
      //unwindPath: ['roles', 'roles.default_complexities','roles.default_complexities.complexities','roles.default_complexities.complexities.scenarios']
      fs.writeFile('./src/server/app/framework/public/admin-data/recruiter.csv', csv, function(err:any){
      //fs.writeFile('E://recruiter.csv', csv, function(err:any) {
        if (err) throw err;
        console.log('recuiter file saved');
      });
    }

    console.log("Success");
    callback(null,result);
  };
}

Object.seal(AdminService);
export = AdminService;
