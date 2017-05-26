import * as fs from 'fs';
var config = require('config');
import * as mongoose from "mongoose";

import Messages = require("../shared/messages");
import ProjectAsset = require("../shared/projectasset");
import UserRepository = require("../dataaccess/repository/user.repository");
import LocationRepository = require("../dataaccess/repository/location.repository");
import RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
import {Recruiter} from "../dataaccess/model/recruiter-final.model";
import JobProfileModel = require("../dataaccess/model/jobprofile.model");
import CandidateRepository = require("../dataaccess/repository/candidate.repository");
import RecruiterModel = require("../dataaccess/model/recruiter.model");
import {ConstVariables} from "../shared/sharedconstants";
import {JobCountModel} from "../dataaccess/model/job-count.model";

class RecruiterService {
  private recruiterRepository:RecruiterRepository;
  private candidateRepository:CandidateRepository;
  private userRepository:UserRepository;
  private locationRepository:LocationRepository;

  APP_NAME:string;

  constructor() {
    this.recruiterRepository = new RecruiterRepository();
    this.userRepository = new UserRepository();
    this.locationRepository=new LocationRepository();
    this.candidateRepository = new CandidateRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  createUser(item:any, callback:(error:any, result:any) => void) {
    console.log("in recruiter service"+JSON.stringify(item));
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
        this.locationRepository.create(item.location, (err, res1) => {
          if (err) {
            callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
          }
          else {
            var locationId=res1._id;
            item.isActivated=false;
            item.isCandidate=false;
            this.userRepository.create(item, (err, res) => {
              if (err) {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
              }
              else {
                var userId1 =res._id;
                var newItem:any ={
                  isRecruitingForself: item.isRecruitingForself,
                  company_name: item.company_name,
                  company_size: item.company_size,
                  company_logo : item.company_logo,
                  userId:userId1,
                  location: locationId
                };
                this.recruiterRepository.create(newItem, (err:any, res:any) => {
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
    });
  }

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.recruiterRepository.retrieve(field, (err,res)=>{
        if(err){
        let er = new Error("Unable to retrieve recruiter details.");
        callback(er, null);
      }else{
          let recruiter : Recruiter = new Recruiter();
          recruiter= res[0];
          if(recruiter){
            recruiter.jobCountModel= new JobCountModel();
            recruiter.jobCountModel.numberOfJobposted= recruiter.postedJobs.length;
          }
          if(res.length>0){
           if(recruiter.postedJobs){
            for(let job of recruiter.postedJobs){
              for(let list of job.candidate_list ){
                  switch (list.name){
                    case ConstVariables.APPLIED_CANDIDATE :
                      recruiter.jobCountModel.totalNumberOfCandidatesApplied += list.ids.length;
                      break;
                    case ConstVariables.CART_LISTED_CANDIDATE :
                      recruiter.jobCountModel.totalNumberOfCandidateInCart += list.ids.length;
                      break;
                    case ConstVariables.REJECTED_LISTED_CANDIDATE :
                      recruiter.jobCountModel.totalNumberOfCandidatesRejected += list.ids.length;
                      break;
                    default : break;
                  }
              }
            }
          }
        }
        callback(null,[recruiter]);
      }
    });
  }

  update(_id: string, item: any, callback: (error: any, result: any) => void) { //Todo change with candidate_id now it is a user_id operation
    this.recruiterRepository.findOneAndUpdate({"userId":new mongoose.Types.ObjectId(_id)},
      {$push:{postedJobs:item.postedJobs}},
      {"new":true, select: {
        postedJobs: {
          $elemMatch:{"postingDate": item.postedJobs.postingDate}
        }
      }},
      function(err, record){
        if(record){
          console.log("Updated record "+ JSON.stringify(record));
          callback(null, record);
        }else{
          let  error : any;
          if(record === null){
            error = new Error("Unable to update posted job maybe recruiter not found. ");
            callback(error, null);
          }
          else{
            callback(err, null);
          }
        }
      });
  }

  findById(id: any, callback: (error: any, result: any) => void) {
    this.recruiterRepository.findById(id, callback);
  }


  getList(item : any,callback:(error:any, result:any)=>void) {
    console.log("333333333333333");
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

  updateDetails(_id: string, item: any, callback: (error: any, result: any) => void) {

    this.recruiterRepository.retrieve({"userId":new mongoose.Types.ObjectId(_id)}, (err, res) => {

      if (err) {
        callback(err, res);
      }
      else {
        this.recruiterRepository.findOneAndUpdate({'_id':res[0]._id}, item, {new: true}, callback);
      }
    });
  }

  getCandidateList(item: any, callback: (error: any, result: any) => void) {
    let query = {
      "postedJobs": {$elemMatch: {"_id": new mongoose.Types.ObjectId(item.jobProfileId)}}
    };
    this.recruiterRepository.retrieve(query, (err, res) => {
      if (err) {
        callback(new Error("Not Found Any Job posted"), null);
      }
      else {
        if (res.length > 0) {
          let candidateIds : string[]= new Array(0);
          let jobProfile: JobProfileModel;
          for (let job of res[0].postedJobs) {
            if (job._id.toString() === item.jobProfileId) {
              jobProfile= job;
              for(let list of job.candidate_list){
                if(list.name==item.listName){
                  candidateIds= list.ids;
                }
              }
            }
          }
          this.candidateRepository.retrieveByMultiIds(candidateIds,{},(err : any, res :any) => {
            if(err){
              callback(new Error("Candidates are not founds"), null);
            }else{
              this.candidateRepository.getCandidateQCard(res,jobProfile, candidateIds,callback);
            }
          })
        }
      }
    });
  }

  getJobById(id: any, callback: (error: any, result: any) => void) {
    let query = {
      "postedJobs": {$elemMatch: {"_id": new mongoose.Types.ObjectId(id)}}
    };
    this.recruiterRepository.retrieve(query, (err: any, res: any) =>  {
      if(err){
        callback(new Error("Problem in Job Retrieve"),null);
      }else {
        let jobProfile:JobProfileModel;
        if (res.length > 0) {
          for (let job of res[0].postedJobs) {
            if (job._id.toString() === id) {
              jobProfile= job;
            }
          }
        }
        callback(null,jobProfile);
      }
    });
  }

}

Object.seal(RecruiterService);
export = RecruiterService;
