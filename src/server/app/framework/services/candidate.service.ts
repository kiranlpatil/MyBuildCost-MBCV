import * as fs from 'fs';
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
        this.locationRepository.create(item.location, (err, res1) => {
          if (err) {
            callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
          }
          else {
            var locationId=res1._id;
            this.userRepository.create(item, (err, res) => {
              if (err) {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
              }
              else {
                var userId1 =res._id;
                var newItem ={
                  isVisible :false,
                  userId:userId1,
                  location: locationId
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
    });
  };
}

Object.seal(CandidateService);
export = CandidateService;
