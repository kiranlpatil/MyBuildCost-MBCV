import JobProfileModel = require("../../dataaccess/model/jobprofile.model");
import CandidateRepository = require("../../dataaccess/repository/candidate.repository");
import ProjectAsset = require("../../shared/projectasset");
class SearchService {
  APP_NAME:string;
  candidateRepository:CandidateRepository;

  constructor() {
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.candidateRepository = new CandidateRepository();
  }

  getMatchingCandidates(jobProfile:JobProfileModel, callback:(error:any, result:any) => void) {

    let data = {
      "industry.name": jobProfile.industry.name,
      //"relocate":true,
      "proficiencies": {$in: jobProfile.proficiencies},
      "interestedIndustries": {$in: jobProfile.interestedIndustries},
      "isVisible":true
    };
    this.candidateRepository.retrieve(data, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        this.candidateRepository.getCandidateQCard(res,jobProfile,callback);
      }
    });
  }
}

Object.seal(SearchService);
export = SearchService;
