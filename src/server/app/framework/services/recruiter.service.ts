import * as fs from 'fs';
var config = require('config');
import * as mongoose from "mongoose";

import Messages = require("../shared/messages");
import ProjectAsset = require("../shared/projectasset");
import UserRepository = require("../dataaccess/repository/user.repository");
import LocationRepository = require("../dataaccess/repository/location.repository");
import RecruiterRepository = require("../dataaccess/repository/recruiter.repository");

class RecruiterService {
  private recruiterRepository:RecruiterRepository;
  private userRepository:UserRepository;
  private locationRepository:LocationRepository;

  APP_NAME:string;

  constructor() {
    this.recruiterRepository = new RecruiterRepository();
    this.userRepository = new UserRepository();
    this.locationRepository=new LocationRepository();
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
    this.recruiterRepository.retrieve(field, callback);
  }

  update(_id: string, item: any, callback: (error: any, result: any) => void) { //Todo change with candidate_id now it is a user_id operation

    this.recruiterRepository.retrieve({"userId":new mongoose.Types.ObjectId(_id)}, (err, res) => {
      if (err) {
        callback(err, res);
      }
      else {
        this.recruiterRepository.pushInJobpost(res[0]._id, item, callback);
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

}

Object.seal(RecruiterService);
export = RecruiterService;
