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
      "proficiencies": {$in: jobProfile.proficiencies},
      "interestedIndustries": {$all: jobProfile.interestedIndustries}
    };
    this.candidateRepository.retrieve(data, (err, res) => {
      console.log("In retrieve"+JSON.stringify(res)) ;
      console.log("In response"+JSON.stringify(err)) ;
      if (err) {
        callback(err, null);
      } else {
        console.log("In Response"+JSON.stringify(res));
        callback(null, res);
        //this.candidateRepository.
        //this.candidateRepository.findOneAndUpdateIndustry({'_id':res[0]._id}, item, {new: true}, callback);
      }
    });
  }

}

Object.seal(SearchService);
export = SearchService;
