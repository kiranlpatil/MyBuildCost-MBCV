import CandidateModel = require("../dataaccess/model/candidate.model");
import RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
import CandidateRepository = require("../dataaccess/repository/candidate.repository");
import CandidateInfoSearch = require("../dataaccess/model/candidate-info-search");

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

  //in below method we use userids for search in candidate repository
  getCandidateInfo(userId:string[], callback:(error:any, result:any) => void) {
    this.candidateRepository.retrieveByMultiRefrenceIdsAndPopulate(userId, {capability_matrix: 0}, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  //in below method we use candidate ids for search in candidate repository
  getCandidateInfoById(id:string[], callback:(error:any, result:any) => void) {
    this.candidateRepository.retrieveByMultiIdsAndPopulate(id, {capability_matrix: 0}, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  buidResultOnCandidateSearch(dataArray:CandidateModel[]) {
    var searchResult:CandidateInfoSearch[] = new Array(0);
    for (let obj of dataArray) {
      if (obj.isCompleted) {
        var data:CandidateInfoSearch = new CandidateInfoSearch();
        data.first_name = obj.userId.first_name;
        data.last_name = obj.userId.last_name;
        data.id = obj._id;
        data.currentCompany = obj.professionalDetails.currentCompany;
        data.designation = obj.jobTitle;
        data.display_string = data.first_name + " " + data.last_name + " " + obj.jobTitle + " " + obj.professionalDetails.currentCompany;
        searchResult.push(data);
      }
    }
    return searchResult;
  }

}

Object.seal(CandidateSearchService);
export = CandidateSearchService;
