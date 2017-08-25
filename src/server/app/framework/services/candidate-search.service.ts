import CandidateModel = require("../dataaccess/model/candidate.model");
import RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
import CandidateRepository = require("../dataaccess/repository/candidate.repository");

class CandidateSearchService {

  private recruiterRepository:RecruiterRepository;
  private candidateRepository:CandidateRepository;

  constructor() {
    this.recruiterRepository = new RecruiterRepository();
    this.candidateRepository = new CandidateRepository();
  }

  searchMatchingJobProfile(candidate:CandidateModel, recruiterId:string, callback:(error:any, result:any) => void) {

    let currentDate = new Date();
    let data = {
      '_id': recruiterId,
      'postedJobs.industry.name': candidate.industry.name,
      'postedJobs.proficiencies': {$in: candidate.proficiencies},
      'postedJobs.expiringDate': {$gte: currentDate}
    };
    let excluded_fields = {
      'postedJobs.industry.roles': 0,
    };
    this.recruiterRepository.retrieveWithLean(data, excluded_fields, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        this.recruiterRepository.getJobProfileQCard(res, candidate, undefined, callback);
      }
    });
  }

  //in below method we use user ids for search in candidate repository
  getCandidateInfo(userId:string[], callback:(error:any, result:any) => void) {
    this.candidateRepository.retrieveByMultiRefrenceIdsAndPopulate(userId, {capability_matrix: 0}, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

}

Object.seal(CandidateSearchService);
export = CandidateSearchService;
