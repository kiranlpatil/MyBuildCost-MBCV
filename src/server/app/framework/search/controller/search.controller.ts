import * as express from "express";
//import AuthInterceptor = require("");
import JobProfileModel = require("../../dataaccess/model/jobprofile.model");
import SearchService = require("../services/search.service");
import CandidateService = require("../../services/candidate.service");
import RecruiterService = require("../../services/recruiter.service");

export class SearchController {
  //searchService : SearchService;
  constructor() {

  }

  getMatchingCandidates(req: express.Request, res: express.Response) {
    let searchService = new SearchService();
    let profileId = req.params.id;
    let recruiterService = new RecruiterService();
    recruiterService.getJobById(profileId, (err: any, jobres: any) => {
      searchService.getMatchingCandidates(jobres, (error: Error, result: any) => {
        if (error) {
          res.status(304).send(error);
        } else {
          res.status(200).send(result);
        }
      });
    });
  }

  getMatchingJobProfiles(req: express.Request, res: express.Response) {
    let searchService = new SearchService();
    let candidateService = new CandidateService();
    let candidateId = req.params.id;
    candidateService.findById(candidateId, (error: Error, candiRes: any) => {
      if (error) {
        res.status(304).send(error);
      } else {
        searchService.getMatchingJobProfile(candiRes, (error: Error, result: any) => {
          if (error) {
            res.status(304).send(error);
          } else {
            res.status(200).send(result);
          }
        });
      }
    });
  }


}
