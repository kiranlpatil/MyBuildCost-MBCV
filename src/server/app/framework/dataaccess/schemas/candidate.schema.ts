import DataAccess = require("../dataaccess");
import User = require("../mongoose/user");
import ICandidate = require("../mongoose/candidate");
import ICapability = require("../mongoose/capability");
import IComplexity = require("../mongoose/complexity");
import IAcademic = require("../mongoose/academics");
import IProficiency = require("../mongoose/proficiency");
import IProfessionalDetails = require("../mongoose/professional-details");
import IEmploymentHistory = require("../mongoose/employment-history");
import IJobProfile = require("../mongoose/job-profile");
import ILocation = require("../mongoose/location");
import IRole = require("../mongoose/role");
import IIndustry = require("../mongoose/industry");
import CapabilityModel = require("../model/capability.model");
var mongoose1 = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var mongoose = require('mongoose');

class CandidateSchema {
  static get schema() {
    var schema = mongoose1.Schema({

      jobTitle :{
        type: String
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
      },
      isVisible: {
        type: Boolean
      },
      aboutMyself: {
        type: String
      },
      certifications: {
        name: String,
        year : String,
        issuedBy : String,
        remark : String
      },
      intrestedIndustries : {
        type: [String]
      },
      awards: {
        name: String,
        year : String,
        issuedBy : String,
        remark : String
      },
      industry:{
        roles: [{
          name: String,
          capabilities: [{
            complexities: [{
              scenarios: {
                name: String
              },
              name: String
            }],
            name: String
          }]
        }]
      },
      location: {
        cityName: String,
        state: String,
        country: String,
        pin: Number
      },
      academics: [{
        schoolName: String,
        board: String,
        yearOfPassing: Number,
        specialization: String
      }],
      professionalDetails: [{
        education: String,
        experience: String,
        currentSalary: String,
        noticePeriod: String,
        relocate: String
      }],
      employmentHistory: [{
        companyName: String,
        designation: String,
        from: {
          month: String,
          year: String
        },
        to: {
          month: String,
          year: String
        },
        remarks: String
      }],
      proficiences: [{
          name:[String]
      }]

    }, {versionKey: false});

    return schema;
  }
}
var schema = mongooseConnection.model<ICandidate>("Candidate", CandidateSchema.schema);
export = schema;
