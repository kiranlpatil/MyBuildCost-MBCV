import JobProfileModel = require("../../dataaccess/model/jobprofile.model");
import CandidateRepository = require("../../dataaccess/repository/candidate.repository");
import ProjectAsset = require("../../shared/projectasset");
import RecruiterRepository = require("../../dataaccess/repository/recruiter.repository");
import CandidateModel = require("../../dataaccess/model/candidate.model");

class SearchService {
  APP_NAME:string;
  candidateRepository:CandidateRepository;
  recruiterRepository:RecruiterRepository;

  constructor() {
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.candidateRepository = new CandidateRepository();
    this.recruiterRepository = new RecruiterRepository();
  }

  getMatchingCandidates(jobProfile:JobProfileModel, callback:(error:any, result:any) => void) {

    let data = {
      "industry.name": jobProfile.industry.name,
      $or: [
        {"professionalDetails.relocate": "Yes"},
        {"location": jobProfile.location}
      ],
      "proficiencies": {$in: jobProfile.proficiencies},
      "interestedIndustries": {$in: jobProfile.interestedIndustries},
      "isVisible": true
    };
    this.candidateRepository.retrieve(data, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        this.candidateRepository.getCandidateQCard(res, jobProfile,false, callback);
      }
    });
  }

  getMatchingJobProfile(candidate : CandidateModel, callback:(error:any, result:any) => void) {

    let data = {
      "postedJobs.industry.name": candidate.industry.name,
      "postedJobs.proficiencies": {$in: candidate.proficiencies},
      /*"interestedIndustries": {$in: candidate.interestedIndustries}*/
    };
    this.recruiterRepository.retrieve(data, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        this.recruiterRepository.getJobProfileQCard(res, candidate, callback);
      }
    });
  }

}

Object.seal(SearchService);
export = SearchService;
