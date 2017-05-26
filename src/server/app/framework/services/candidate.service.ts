import * as fs from 'fs';
import * as mongoose from "mongoose";
var config = require('config');
import Messages = require("../shared/messages");
import ProjectAsset = require("../shared/projectasset");
import CandidateRepository = require("../dataaccess/repository/candidate.repository");
import UserRepository = require("../dataaccess/repository/user.repository");
import LocationRepository = require("../dataaccess/repository/location.repository");
import RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
import RecruiterModel = require("../dataaccess/model/recruiter.model");
class CandidateService {
  private candidateRepository:CandidateRepository;
  private recruiterRepository:RecruiterRepository;
  private userRepository:UserRepository;
  private locationRepository:LocationRepository;

  APP_NAME:string;

  constructor() {
    this.candidateRepository = new CandidateRepository();
    this.userRepository = new UserRepository();
    this.recruiterRepository = new RecruiterRepository();
    this.locationRepository=new LocationRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  createUser(item:any, callback:(error:any, result:any) => void) {
    this.userRepository.retrieve({"email": item.email}, (err, res) => {
      if(err) {
        callback(new Error(err), null);
      }
      else if (res.length > 0) {
        if (res[0].isActivated === true) {
          callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
        } else if (res[0].isActivated === false) {
          callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
        }
      }
      else {
            item.isCandidate=true;
            this.userRepository.create(item, (err, res) => {
              if (err) {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
              }
              else {
                var userId1 =res._id;
                var newItem :any={
                  userId:userId1,
                  location : item.location
                };
                this.candidateRepository.create(newItem, (err:any, res:any) => {
                  if (err) {
                    callback(err, null);
                  }else{
                    callback(null, res);
                  }
                });
              }
            });
      }
    });
  }

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.candidateRepository.retrieve(field, (err, result)=>{
      if(err){
          callback(err, null);
      }
      else{
          if(result.length>0){
            result[0].academics = result[0].academics.sort(function(a:any,b:any){return b.yearOfPassing - a.yearOfPassing});
            result[0].awards = result[0].awards.sort(function(a:any,b:any){return b.year - a.year});
            result[0].certifications = result[0].certifications.sort(function(a:any,b:any){return b.year - a.year});

            callback(null, result);
          }
      }
    });
  }

  findById(id: any, callback: (error: any, result: any) => void) {
    this.candidateRepository.findById(id, callback);
  }

  update(_id: string, item: any, callback: (error: any, result: any) => void) {

    this.candidateRepository.retrieve({"userId":new mongoose.Types.ObjectId(_id)}, (err, res) => {

      if (err) {
        callback(err, res);
      }
      else {
        this.candidateRepository.findOneAndUpdateIndustry({'_id':res[0]._id}, item, {new: true}, callback);
      }
    });
  }

  getList(item : any,callback:(error:any, result:any)=>void) {
    let query = {
      "postedJobs._id": {$in: item.ids},
    };
    this.recruiterRepository.retrieve(query,(err,res)=> {
        if(err){
          callback(err,null);
        }else{
          this.recruiterRepository.getJobProfileQCard(res, item.candidate, item.ids , (canError,canResult)=>{
            if(canError){
              callback(canError, null);
            }else{
              callback(null,canResult);
            }
          });
        }
    });
  }

}

Object.seal(CandidateService);
export = CandidateService;
