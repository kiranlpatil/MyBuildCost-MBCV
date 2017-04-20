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
}

Object
  .seal(CandidateRepository);

export = CandidateRepository;
