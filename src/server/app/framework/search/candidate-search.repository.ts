import CandidateSchema = require("../dataaccess/schemas/candidate.schema");
import * as mongoose from "mongoose";
import CandidateModel = require("../dataaccess/model/candidate.model");
import IndustryModel = require("../dataaccess/model/industry.model");
import CandidateCardViewModel = require("../dataaccess/model/candidate-card-view.model");
import JobProfileModel = require("../dataaccess/model/jobprofile.model");
import ICandidate = require("../dataaccess/mongoose/candidate");
import RepositoryBase = require("../dataaccess/repository/base/repository.base");


class CandidateSearchRepository extends RepositoryBase<ICandidate> {

  constructor() {
    super(CandidateSchema);
  }

  getCandidateByIndustry(jobProfile:JobProfileModel, callback:(error:any, result:any) => void) { //todo change it with new approach

    if (jobProfile.industry.roles.length > 2) {
      CandidateSchema.find({
        $and: [
          {'industry.name': jobProfile.industry.name},
          {'industry.roles': {"$elemMatch": {name: jobProfile.industry.roles[0].name}}},
          {'industry.roles': {"$elemMatch": {name: jobProfile.industry.roles[1].name}}},
          {'industry.roles': {"$elemMatch": {name: jobProfile.industry.roles[2].name}}},
        ]
      }, (error:any, res:any)=> {
        this.filterCandidates(res, jobProfile.industry, callback);
      });
    } else if (jobProfile.industry.roles.length > 1) {
      CandidateSchema.find({
        $and: [
          {'industry.name': jobProfile.industry.name},
          {'industry.roles': {"$elemMatch": {name: jobProfile.industry.roles[0].name}}},
          {'industry.roles': {"$elemMatch": {name: jobProfile.industry.roles[1].name}}},
        ]
      }, (error:any, res:any)=> {
        this.filterCandidates(res, jobProfile.industry, callback);
      });
    } else if (jobProfile.industry.roles.length > 0) {
      CandidateSchema.find({
        $and: [
          {'industry.name': jobProfile.industry.name},
          {'industry.roles': {"$elemMatch": {name: jobProfile.industry.roles[0].name}}},
        ]
      }, (error:any, res:any)=> {
        this.filterCandidates(res, jobProfile.industry, callback);
      });
    }
  }

  filterCandidates(candidates:CandidateModel[], industry:IndustryModel, callback:(err:any, result:any)=>void) {
    let countOfComplexity = 0;
    let satisfiedComplexity = 0;
    for (let role of industry.roles) {
      for (let capability of role.capabilities) {
        for (let complexity of capability.complexities) {
          countOfComplexity++;
        }
      }
    }
    console.log("Count of complexity " + countOfComplexity)
    let cardcandidates:CandidateCardViewModel[] = new Array(0);
    for (let role of industry.roles) {
      for (let capability of role.capabilities) {
        for (let candidate of candidates) {
          let tempCandidate: CandidateCardViewModel= new CandidateCardViewModel();
          tempCandidate.userId=  candidate.userId;
           for (let candiRole of candidate.industry.roles) {
            for (let candiCapability of candiRole.capabilities) {
              if (capability.name == candiCapability.name) {
                for (let complexity of capability.complexities) {
                  for (let candicomplexity of candiCapability.complexities) {
                    if (complexity.name == candicomplexity.name) {
                      for (let scenario of complexity.scenarios) {
                        if (scenario.isChecked) {
                          for (let candiScenario of candicomplexity.scenarios) {
                            if (scenario.name == candiScenario.name) {
                              if (candiScenario.isChecked) {
                                tempCandidate.matchedComplexity++;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          tempCandidate.matching = (tempCandidate.matchedComplexity *100)/ countOfComplexity ;
          if(tempCandidate.matching>0){
            cardcandidates.push(tempCandidate);
          }
        }
      }
    }
    callback(null,cardcandidates);
  }

}

Object
  .seal(CandidateSearchRepository);

export = CandidateSearchRepository;
