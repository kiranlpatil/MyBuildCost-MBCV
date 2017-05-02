import * as express from "express";
import AuthInterceptor = require("");
import * as mongoose from "mongoose";
import JobProfileModel = require("../../dataaccess/model/jobprofile.model");
import SearchService = require("../services/search.service");

export class SearchController {
  private searchService:SearchService = new SearchService();

  retrieve(req:express.Request, res:express.Response) {
    let jobmodel:JobProfileModel = <JobProfileModel>req.body;
    this.searchService.getmatchingCandidates(jobmodel, (error : Error,result : any)=>{
        if(error){

        }else{
          res.status(200).send(result);
        }
    });
  }

}
