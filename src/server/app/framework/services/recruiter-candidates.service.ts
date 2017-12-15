import * as mongoose from "mongoose";
import {ManagedCandidatesSummary} from "../dataaccess/model/managed-candidates-summary";
import RecruiterCandidatesModel = require("../dataaccess/model/recruiter-candidate.model");
import RecruiterCandidatesRepository = require("../dataaccess/repository/recruiter-candidates.repository");
import RecruiterCandidates = require("../dataaccess/mongoose/recruiter-candidates");

export class RecruiterCandidatesService {

  update(data: any, callback: (error: Error, data: RecruiterCandidatesModel) => void) {

    data.statusUpdatedOn = new Date();

    let searchQuery = {
      'mobileNumber': data.mobileNumber,
      'recruiterId': data.recruiterId
    };

    let recruiterCandidatesRepository = new RecruiterCandidatesRepository();
    recruiterCandidatesRepository.updateWithQuery(searchQuery, data, {upsert: true}, (error: Error, data: RecruiterCandidatesModel) => {
      callback(error, data);
    });

  }

  getSummary(recruiterCandidatesModel: RecruiterCandidatesModel, callback: (error: Error, data: RecruiterCandidatesModel[]) => void) {

    let newDate = new Date(recruiterCandidatesModel.toDate);
    newDate.setDate(newDate.getDate() + 1);  //To get records of current date and for same from and to date
    let searchQuery = {
      'recruiterId': new mongoose.Types.ObjectId(recruiterCandidatesModel.recruiterId),
      'statusUpdatedOn': {
        $lte: newDate,
        $gte: new Date(recruiterCandidatesModel.fromDate)
      },
      'source': recruiterCandidatesModel.source
    };

    let recruiterCandidatesRepository = new RecruiterCandidatesRepository();
    recruiterCandidatesRepository.retrieve(searchQuery, (error: Error, recruiterCandidatesData: RecruiterCandidatesModel[]) => {
      callback(error, recruiterCandidatesData);
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
        case 'Existing' :
          summary.existing++;
          break;
      }
      summary.total++;
    }
    return summary;
  }

}
