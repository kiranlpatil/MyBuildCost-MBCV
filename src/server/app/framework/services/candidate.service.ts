import * as fs from 'fs';
import * as mongoose from "mongoose";
import * as sort from "sort-object-array";
var config = require('config');
import Messages = require("../shared/messages");
import ProjectAsset = require("../shared/projectasset");
import CandidateRepository = require("../dataaccess/repository/candidate.repository");
import UserRepository = require("../dataaccess/repository/user.repository");
import LocationRepository = require("../dataaccess/repository/location.repository");
class CandidateService {
  private candidateRepository:CandidateRepository;
  private userRepository:UserRepository;
  private locationRepository:LocationRepository;

  APP_NAME:string;

  constructor() {
    this.candidateRepository = new CandidateRepository();
    this.userRepository = new UserRepository();
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
            result[0].academics = sort(result[0].academics, ['yearOfPassing'], ['desc']);
            result[0].awards = sort(result[0].awards, ['year'], ['desc']);
            result[0].certifications = sort(result[0].certifications, ['year'], ['desc']);
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
}

Object.seal(CandidateService);
export = CandidateService;
