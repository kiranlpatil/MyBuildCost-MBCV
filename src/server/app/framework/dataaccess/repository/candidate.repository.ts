import CandidateSchema = require("../schemas/candidate.schema");
import RepositoryBase = require("./base/repository.base");
import ICandidate = require("../mongoose/candidate");
import * as mongoose from "mongoose";
import JobProfileModel = require("../model/jobprofile.model");
import CandidateModel = require("../model/candidate.model");
import IndustryModel = require("../model/industry.model");
import CandidateCardViewModel = require("../model/candidate-card-view.model");


class CandidateRepository extends RepositoryBase<ICandidate> {

  constructor() {
    super(CandidateSchema);
  }

  getCandidateByBasicInfo(job:JobProfileModel, callback:(err, res)=> void) {
    CandidateSchema.aggregate([{
      $match: {
        $and: [
          {"industry.name": job.industry.name},
          //{"relocate":job},
          {"proficiencies": {$all: job.profiences}},
          {"intrestedIndustries": {$all: job.interestedIndustry}}
        ]
      }
    }], (error, response)=> {
      this.getCandidateQCard(response, job, callback)
    })
  }

  getCandidateQCard(candidates:CandidateModel[], job:JobProfileModel, callback:(err, res)=> void) {
        for(let candidate  of candidates){

        }
  }


}

Object
  .seal(CandidateRepository);

export = CandidateRepository;
