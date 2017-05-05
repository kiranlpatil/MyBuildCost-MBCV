import * as express from "express";
//import AuthInterceptor = require("");
import * as mongoose from "mongoose";
import JobProfileModel = require("../../dataaccess/model/jobprofile.model");
import SearchService = require("../services/search.service");

export class SearchController {
  //searchService : SearchService;
  constructor(){

  }

  retrieve(req:express.Request, res:express.Response) {
    let searchService= new SearchService();
    let jobModel:JobProfileModel = <JobProfileModel>req.body;
    searchService.getMatchingCandidates(jobModel, (error : Error,result : any)=>{
        if(error){
          res.status(304).send(error);
        }else{
          res.status(200).send(result);
        }
    });
  }

}
