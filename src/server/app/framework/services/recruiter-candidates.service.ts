import * as mongoose from "mongoose";
import {ManagedCandidatesSummary} from "../dataaccess/model/managed-candidates-summary";
import RecruiterCandidatesModel = require("../dataaccess/model/recruiter-candidate.model");
import RecruiterCandidatesRepository = require("../dataaccess/repository/recruiter-candidates.repository");
import RecruiterCandidates = require("../dataaccess/mongoose/recruiter-candidates");

export class RecruiterCandidatesService {

  update(recruiterId: string, candidateId: string, mobileNumber: number, status: string,
         callback: (error: Error, data: RecruiterCandidatesModel) => void) {

    let updateQuery: any;
    if(candidateId != '') {
      updateQuery = {
        $set: {
          'status': status,
          'candidateId': candidateId,
          'statusUpdatedOn': new Date(),
          'source': 'career plugin',
        }
      };
    } else {
      updateQuery = {
        $set: {
          'status': status,
          'statusUpdatedOn': new Date(),
          'source': 'career plugin',
        }
      };
    }


    let searchQuery = {
      'mobileNumber': mobileNumber,
      'recruiterId': recruiterId
    };

    let recruiterCandidatesRepository = new RecruiterCandidatesRepository();
    recruiterCandidatesRepository.findOneAndUpdate(searchQuery, updateQuery, {upsert: true}, (error: Error, data: RecruiterCandidatesModel) => {
      callback(error, data);
    });

  }

  getSummary(id: string, fromDate: string, toDate: string, callback: (error: Error, data: RecruiterCandidatesModel[]) => void) {

    let newDate = new Date(toDate);
      let numberOfDaysToAdd = 1;
      newDate.setDate(newDate.getDate() + numberOfDaysToAdd);
      let searchQuery = {
        'recruiterId': new mongoose.Types.ObjectId(id),
        'statusUpdatedOn': {
          $lte: newDate,
          $gte: new Date(fromDate)
        }
      };

    let recruiterCandidatesRepository = new RecruiterCandidatesRepository();
    recruiterCandidatesRepository.retrieve(searchQuery, (error: Error, data: RecruiterCandidatesModel[]) => {
      callback(error, data);
    });

  }

  sortSummaryData(data: RecruiterCandidatesModel[]) {
    let summary: ManagedCandidatesSummary = new ManagedCandidatesSummary();

    for (let i of data) {
      switch (i.status) {
        case 'Applied' :
          summary.applied++;
          break;
        case 'Registered' :
          summary.registered++;
          break;
        case 'Profile submitted' :
          summary.profileSubmitted++;
          break;
        case 'Logged In' :
          summary.existing++;
          break;
      }
      summary.total++;
    }
    return summary;
  }

}
