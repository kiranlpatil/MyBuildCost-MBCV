import ProjectAsset = require("../shared/projectasset");
import JobProfileModel = require("../../dataaccess/model/jobprofile.model");
import CandidateRepository = require("../../dataaccess/repository/candidate.repository");
class SearchService {
  APP_NAME:string;
  candidateRepository : CandidateRepository;
  constructor() {
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.candidateRepository= new CandidateRepository;
  }

  getmatchingCandidates(jobProfile: JobProfileModel, callback: (error: any, result: any) => void) {

    this.candidateRepository.getCandidateByBasicInfo(jobProfile, (err, res) => {
      if (err) {
        callback(err, res);
      }else {

        this.candidateRepository.
        //this.candidateRepository.findOneAndUpdateIndustry({'_id':res[0]._id}, item, {new: true}, callback);
      }
    });
  }

}

Object.seal(SearchService);
export = SearchService;
