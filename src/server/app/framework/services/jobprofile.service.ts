import * as fs from 'fs';
var config = require('config');
import Messages = require("../shared/messages");
import ProjectAsset = require("../shared/projectasset");
import UserRepository = require("../dataaccess/repository/user.repository");
import LocationRepository = require("../dataaccess/repository/location.repository");
import RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
import JobProfileRepository = require("../dataaccess/repository/job-profile.repository");

class JobProfileService {
  private jobprofileRepository:JobProfileRepository;

  APP_NAME:string;

  constructor() {
    this.jobprofileRepository=new JobProfileRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  create(item:any, callback:(error:any, result:any) => void) {
    this.jobprofileRepository.create( item, (err, res) => {
      if(err) {
        callback(new Error(err), null);
      }else {
        callback(null,res);
      }
    });
  }

}

Object.seal(JobProfileService);
export = JobProfileService;
