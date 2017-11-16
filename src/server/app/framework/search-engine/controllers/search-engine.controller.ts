import * as express from 'express';
import { CandidateSearchEngine } from '../engines/candidate-search.engine';
import { AppliedFilter } from '../models/input-model/applied-filter';
import { EList } from '../models/input-model/list-enum';
import { JobDetail } from '../models/output-model/job-detail';
import { JobSearchService } from '../services/job-search.service';
import { BaseDetail } from '../models/output-model/base-detail';
import { CandidateSearchService } from '../services/candidate-search.service';
import {JobSearchEngine} from '../engines/job-search.engine';
import {CandidateDetail} from "../models/output-model/candidate-detail";
import {SearchEngine} from "../engines/search.engine";
import {SearchService} from "../services/search.service";

export class SearchEngineController {
    getMatchingProfile(req: express.Request, res: express.Response, next: any) : void {
      let profileId = req.params.id;
      let searchEngine : SearchEngine;
      let searchService : SearchService;
      let isMatchList : boolean = false;
      let appliedFilters : AppliedFilter = req.body.obj;
      let objectId : string;
      if(profileId) {
        objectId = profileId;
        searchEngine = new CandidateSearchEngine();
        searchService  = new CandidateSearchService();
        if(appliedFilters.listName === EList.CAN_MATCHED) {
          isMatchList = true;
        }
      }else {
        objectId= req.params.candidateId;
        searchEngine = new JobSearchEngine();
        searchService = new JobSearchService();
        if(appliedFilters.listName === EList.JOB_MATCHED) {
          isMatchList = true;
        }
      }
      searchService.getUserDetails(objectId, (err: Error, againstDetails: BaseDetail) => {
        if(err) {
          res.send();
        } else {
          let criteria : any;
          if(isMatchList) {
            criteria = searchEngine.buildBusinessCriteria(againstDetails);
          }else {
            let ids = searchService.getObjectIdsByList(againstDetails, appliedFilters.listName);
            criteria = { '_id': { $in: ids}};
          }
          let mainCriteria =searchEngine.buildUserCriteria(appliedFilters,criteria);
          searchEngine.getMatchingObjects(mainCriteria, (error : any, response : any[]) => {
            if(error) {
              res.send();
            }else {
              let q_cards = searchEngine.buildQCards(response,againstDetails,appliedFilters.sortBy);
              res.status(200).send(q_cards);
            }
          });
        }
      });
    }
}
