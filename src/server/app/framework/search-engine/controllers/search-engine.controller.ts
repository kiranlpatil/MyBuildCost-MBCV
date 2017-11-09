import * as express from 'express';
import { SearchService } from '../services/search.service';
import { CandidateSearchService } from '../services/candidate-search.service';
import { CandidateSearchEngine } from '../engines/candidate-search.engine';
import { AppliedFilter } from '../models/input-model/applied-filter';
import { EList } from '../models/input-model/list-enum';
import { JobDetail } from '../models/output-model/job-detail';
import { ESort } from '../models/input-model/sort-enum';
import {JobSearchEngine} from '../engines/job-search.engine';
import {JobSearchService} from '../services/job-search.service';
import {BaseDetail} from '../models/output-model/base-detail';

export class SearchEngineController {
    getMatchingProfile(req: express.Request, res: express.Response, next: any) : void {
  //    let searchEngine = new CandidateSearchEngine();
      let searchEngine = new JobSearchEngine();
      //searchEngine.getMatchingObjects();
      let jobId: string = '59f7123643226039446e9ff0';
      let appliedFilter : AppliedFilter = new AppliedFilter();
      appliedFilter.listName = EList.CAN_MATCHED;
     /* appliedFilter.sortBy = ESort.SALARY;
      appliedFilter.minExperience =2;
      appliedFilter.maxExperience =4;
*/
    // let searchService : SearchService = new CandidateSearchService();
     let searchService  = new JobSearchService();
      searchService.getUserDetails(jobId, (err: Error, againstDetails: BaseDetail) => {
        if(err) {
          res.send();
        } else {
          let criteria : any;
          //if(appliedFilter.listName === EList.CAN_MATCHED) {
          if(appliedFilter.listName === EList.JOB_MATCHED) {
            criteria = searchEngine.buildBusinessCriteria(againstDetails, appliedFilter.listName);
          }else {
            criteria = {_id: {$in: ['A','B']}};
          }
          let mainCriteria =searchEngine.buildUserCriteria(appliedFilter,criteria);
          searchEngine.getMatchingObjects(mainCriteria, (error : any, response : any) => {
            if(error) {
              res.send();
            }else {
              searchService.getJobsByCriteria(response,againstDetails); //todo send this response to buildQcard
              let q_cards = searchEngine.buildQCards(response,jobDetails,appliedFilter.sortBy);
              res.status(200).send({
                'data': q_cards
              });
            }
          });
        }
      });
    }
}
