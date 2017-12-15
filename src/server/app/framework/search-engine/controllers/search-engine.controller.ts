import * as express from "express";
import {CandidateSearchEngine} from "../engines/candidate-search.engine";
import {AppliedFilter} from "../models/input-model/applied-filter";
import {EList} from "../models/input-model/list-enum";
import {JobSearchService} from "../services/job-search.service";
import {CoreMatchingDetail} from "../models/output-model/base-detail";
import {JobSearchEngine} from "../engines/job-search.engine";
import {SearchEngine} from "../engines/search.engine";
import {SearchService} from "../services/search.service";
import {CandidateDetailsWithJobMatching} from "../../dataaccess/model/candidatedetailswithjobmatching";
import CandidateService = require("../../services/candidate.service");

export class SearchEngineController {
  getMatchingCandidates(req: express.Request, res: express.Response, next: any): void {
    let jobId = req.params.id;
    let appliedFilters: AppliedFilter = req.body.obj;
    let searchEngine: SearchEngine = new CandidateSearchEngine();
    searchEngine.getMatchingResult(searchEngine, jobId, appliedFilters, (error: any, qcards: any[],userId:string) => {
      if (error) {
        next(error);
        return;
      }
      res.status(200).send(qcards);
    });
  }

  getMatchingJobs(req: express.Request, res: express.Response, next: any): void {
    let candidateId = req.params.candidateId;
    let appliedFilters: AppliedFilter = req.body.obj;
    let searchEngine: SearchEngine = new JobSearchEngine();
    searchEngine.getMatchingResult(searchEngine, candidateId, appliedFilters, (error: any, qcards: any[],userId:string) => {
      if (error) {
        next(error);
        return;
      }
      res.status(200).send(qcards);
    });
  }

  getMatchingJobsForCandidate(req: express.Request, res: express.Response, next: any): void {
    let candidateId = req.params.candidateId;
    let appliedFilters: AppliedFilter = req.body.obj;
    let searchEngine: SearchEngine = new JobSearchEngine();
    appliedFilters.isCandidateSearch=true;
    searchEngine.getMatchingResult(searchEngine, candidateId, appliedFilters, (error: any, qcards: any[],userId:string) => {
      if (error) {
        next(error);
        return;
      }
      let candidateService = new CandidateService();
      candidateService.get(userId, (error, candidateDetails) => {
        if (error) {
          next(error);
        }
        let _candidateDetails: CandidateDetailsWithJobMatching;
        let jobSearchService = new JobSearchService();
        _candidateDetails = jobSearchService.getCandidateVisibilityAgainstRecruiter(candidateDetails, qcards);
        _candidateDetails.jobQCardMatching = candidateDetails.isVisible ? qcards : [];
        res.send({
          'status': 'success',
          'data': _candidateDetails
        });
      });
    });
  }

  getMasterDataForRecruiterFilter(req: express.Request, res: express.Response, next: any): void {
    let jobId = req.params.jobId;
    let appliedFilters: AppliedFilter = req.body.obj;
    let searchEngine: SearchEngine = new CandidateSearchEngine();
    appliedFilters.isMasterData=true;
    searchEngine.getMatchingResult(searchEngine, jobId, appliedFilters, (error: any, masterData: any[],userId:string) => {
      if (error) {
        next(error);
        return;
      }
      res.status(200).send(masterData);
    });
  }

}
