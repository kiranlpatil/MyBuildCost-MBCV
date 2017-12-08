import * as mongoose from "mongoose";
import RecruiterCandidatesModel = require("../dataaccess/model/recruiter-candidate.model");
import RecruiterCandidatesRepository = require("../dataaccess/repository/recruiter-candidates.repository");
import RecruiterCandidates = require("../dataaccess/mongoose/recruiter-candidates");

export class RecruiterCandidatesService {

  add(data: any, callback: (error: Error, status: any) => void) {
    data.statusUpdatedOn = new Date();

    let recruiterCandidatesRepository = new RecruiterCandidatesRepository();
    recruiterCandidatesRepository.create(data, (error: Error, status: any) => {
      callback(error, status);
    });

  }

  update(data: any, callback: (error: Error, status: any) => void) {
    data.statusUpdatedOn = new Date();

    let updateQuery = {
      $set: {
        'status': data.status,
        'candidateId': data.candidateId
      }
    };

    let searchQuery = {
      'mobileNumber': data.mobileNumber,
      'recruiterId' : data.recruiterId
    };

    let recruiterCandidatesRepository = new RecruiterCandidatesRepository();
    recruiterCandidatesRepository.findOneAndUpdate(searchQuery,updateQuery, {new : true}, (error: Error, status: any) => {
      callback(error, status);
    });

  }

  getSummary(id: number, fromDate: string, toDate: string, callback: (error: Error, data: any) => void) {

    let d1 = toDate.split("-");
    let year: number = Number(d1[0]);
    let month: number = Number(d1[1]);
    let date: number = Number(d1[2]);

    let d2 = fromDate.split("-");
    let year1: number = Number(d2[0]);
    let month1: number = Number(d2[1]);
    let date1: number = Number(d2[2]);

    let searchQuery = {
      'recruiterId' : new mongoose.Types.ObjectId(id),
      'statusUpdatedOn' :{
        $lte: new Date(year, month - 1, date),
        $gte: new Date(year1, month1 - 1, date1)
      }
    };

    let recruiterCandidatesRepository = new RecruiterCandidatesRepository();
    recruiterCandidatesRepository.retrieve(searchQuery, (error: Error, data: any) => {
      callback(error, data);
    });

  }

  sortData(data: any) {
    let summary: any = {};
    let applied: number = 0;
    let registered: number = 0;
    let profileSubmitted: number = 0;
    let existing: number = 0;
    let total: number = 0;

    for(let i of data) {
      if(i.status == 'Applied') {
        applied++;
      }else if(i.status == 'Registered') {
        registered++;
      }else if(i.status == 'Profile submitted') {
        profileSubmitted++;
      }else if(i.status == 'Logged In') {
        existing++;
      }

    }

    summary["applied"] = applied;
    summary["registered"] = registered;
    summary["profileSubmitted"] = profileSubmitted;
    summary["existing"] = existing;
    summary["total"] = applied + registered + profileSubmitted + existing;
    return summary;
  }

}
