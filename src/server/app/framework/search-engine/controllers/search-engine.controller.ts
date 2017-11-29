import * as express from 'express';
import { CandidateSearchEngine } from '../engines/candidate-search.engine';
import { AppliedFilter } from '../models/input-model/applied-filter';
import { EList } from '../models/input-model/list-enum';
import { JobSearchService } from '../services/job-search.service';
import { CoreMatchingDetail } from '../models/output-model/base-detail';
import { CandidateSearchService } from '../services/candidate-search.service';
import {JobSearchEngine} from '../engines/job-search.engine';
import {SearchEngine} from "../engines/search.engine";
import {SearchService} from "../services/search.service";
import {CandidateDetailsWithJobMatching} from "../../dataaccess/model/candidatedetailswithjobmatching";
import CandidateService = require("../../services/candidate.service");

export class SearchEngineController {
  getMatchingCandidates(req: express.Request, res: express.Response, next: any): void {
    let jobId = req.params.id;
    let appliedFilters: AppliedFilter = req.body.obj;
    let searchEngine: SearchEngine = new CandidateSearchEngine();
    searchEngine.getMatchingResult(searchEngine, jobId, next, appliedFilters, res);
  }

  getMatchingJobs(req: express.Request, res: express.Response, next: any): void {
    let candidateId = req.params.candidateId;
    let appliedFilters: AppliedFilter = req.body.obj;
    let searchEngine: SearchEngine = new JobSearchEngine();
    searchEngine.getMatchingResult(searchEngine, candidateId, next, appliedFilters, res);
  }

/*
  getMatchingProfile(req: express.Request, res: express.Response, next: any): void {
    let profileId = req.params.id;
    let searchEngine: SearchEngine;
    let searchService: SearchService;
    let isMatchList: boolean = false;
    let appliedFilters: AppliedFilter = req.body.obj;
    let objectId: string;
    if (profileId) {
      objectId = profileId;
      searchEngine = new CandidateSearchEngine();
      searchService = new CandidateSearchService();
      if (appliedFilters.listName === EList.CAN_MATCHED) {
        isMatchList = true;
      }
    } else {
      objectId = req.params.candidateId;
      searchEngine = new JobSearchEngine();
      searchService = new JobSearchService();
      if (appliedFilters.listName === EList.JOB_MATCHED) {
        isMatchList = true;
      }
    }

    searchService.getCoreMatchingDetails(objectId, (err: Error, againstDetails: CoreMatchingDetail) => {
      if (err) {
        next(err);
      } else {
        let criteria: any;
        if (isMatchList) {
          criteria = searchEngine.buildBusinessCriteria(againstDetails);
        } else {
          let ids = searchService.getObjectIdsByList(againstDetails, appliedFilters.listName);
          criteria = {'_id': {$in: ids}};
        }
        let mainCriteria = searchEngine.buildUserCriteria(appliedFilters, criteria);
        let sortingQuery = searchEngine.getSortedCriteria(appliedFilters, criteria);
        let includedFields = searchEngine.getRequiredFieldNames();

        searchEngine.getMatchingObjects(mainCriteria, includedFields, sortingQuery, (error: any, response: any[]) => {
          if (error) {
            next(error);
          } else {
            searchEngine.buildQCards(response, againstDetails, appliedFilters,(error: any, qcards: any[]) => {
              if (error) {
                next(error);
              } else {
                  res.status(200).send(qcards);
              }
            });
          }
        });
      }
    });
  }
*/

  getMatchingJobProfiles(req: express.Request, res: express.Response, next: any): void {
    // let searchEngine: SearchEngine;
    // let searchService: SearchService;
    // let isMatchList: boolean = false;
    // let appliedFilters: AppliedFilter = req.body.obj;
    // let objectId: string;
    // let jobSearchService = new JobSearchService();
    // //let candId = req.params.id;
    // let candidateService = new CandidateService();
    //
    // objectId = req.params.candidateId;
    // searchEngine = new JobSearchEngine();
    // searchService = new JobSearchService();
    // if (appliedFilters.listName === EList.JOB_MATCHED) {
    //   isMatchList = true;
    // }
    //
    // searchService.getCoreMatchingDetails(objectId, (err: Error, againstDetails: CoreMatchingDetail) => {
    //   if (err) {
    //     next(err);
    //   } else {
    //     let candidateDetails = againstDetails;
    //     let criteria: any;
    //     if (isMatchList) {
    //       criteria = searchEngine.buildBusinessCriteria(againstDetails);
    //     } else {
    //       let ids = searchService.getObjectIdsByList(againstDetails, appliedFilters.listName);
    //       criteria = {'_id': {$in: ids}};
    //     }
    //
    //     let mainCriteria = searchEngine.buildUserCriteria(appliedFilters, criteria);
    //     searchEngine.getMatchingObjects(mainCriteria, {},{},
    //       (error: any, response: any[]) => {
    //       if (error) {
    //         next(error);
    //       } else {
    //         searchEngine.buildQCards(response, againstDetails, appliedFilters,
    //           (error: any, response: any[]) => {
    //             if (error) {
    //               next(error);
    //             } else {
    //               res.status(200).send(response);
    //               /*candidateService.get(againstDetails.userId, (error, candidateDetails) => {
    //                 if(error) {
    //                   next(error);
    //                 }
    //                 let _candidateDetails: CandidateDetailsWithJobMatching;
    //                 _candidateDetails = jobSearchService.getCandidateVisibilityAgainstRecruiter(candidateDetails, jobQCardMatching);
    //                 _candidateDetails.jobQCardMatching = candidateDetails.isVisible ? jobQCardMatching : [];
    //                 res.send({
    //                   'status': 'success',
    //                   'data': _candidateDetails
    //                 });
    //               });*/
    //             }
    //         });
    //       }
    //     });
    //   }
    // });
  }
}
