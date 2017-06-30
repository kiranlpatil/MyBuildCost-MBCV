import DataAccess = require("../dataaccess");
import User = require("../mongoose/user");
import IRecruiter = require("../mongoose/recruiter");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class RecruiterSchema {
  static get schema() {
    var schema = mongoose.Schema({
      userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
      },
      company_name: {
        type: String
      },
      company_size: {
        type: String
      },
      company_logo: {
        type: String
      },
      company_headquarter_country: {
        type: String
      },
      about_company: {
        type: String
      },
      setOfDocuments: {
        type: [String]
      },
      postedJobs: [{
        capability_matrix : {
          type : Object
        },
        candidate_list: [{
          name: String,
          ids: [{
            type: String
          }]
        }],
        location: {
          city: String,
          state: String,
          country: String,
          pin: String
        },
        joiningPeriod: {
          type: String
        },
        jobTitle: {
          type: String
        },
        hiringManager: {
          type: String
        },
        department: {
          type: String
        },
        education: {
          type: String
        },
        /*experience: {
          type: String
        },*/
        experienceMinValue: {
          type: String
        },
        experienceMaxValue: {
          type: String
        },
        salaryMinValue: {
         type: String
         },
         salaryMaxValue: {
         type: String
         },
        /*salary: {
          type: String
        },*/
        proficiencies: {
          type: [String]
        },
        additionalProficiencies: {
          type: [String]
        },
        interestedIndustries: {
          type: [String]
        },

        industry: {
          name: String,
          roles: [{
            code: String,
            name: String,
            capabilities: [{
              code: String,
              complexities: [{
                code: String,
                scenarios: [{
                  name: String,
                  isChecked: Boolean,
                  code: String
                }],
                name: String
              }],
              name: String,
              isPrimary: Boolean,
              isSecondary: Boolean
            }],
            default_complexities: [{
              code: String,
              complexities: [{
                code: String,
                scenarios: [{
                  name: String,
                  isChecked: Boolean,
                  code: String
                }],
                name: String
              }],
              name: String
            }]
          }]
        },
        competencies: {
          type: String
        },
        responsibility: {
          type: String
        },
        postingDate: {
          type: Date
        }
      }]
    }, {versionKey: false});

    return schema;
  }
}
var schema = mongooseConnection.model<IRecruiter>("Recruiter", RecruiterSchema.schema);
export = schema;
