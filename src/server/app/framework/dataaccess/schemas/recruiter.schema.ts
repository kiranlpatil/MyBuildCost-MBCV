import DataAccess = require('../dataaccess');
import User = require('../mongoose/user');
import IRecruiter = require('../mongoose/recruiter');

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class RecruiterSchema {
  static get schema() {
    let schema = mongoose.Schema({
      userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
      },
      company_name: {
        type: String
      },
      company_size: {
        type: String
      },
      company_website: {
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
      isRecruitingForself: {
        type: Boolean
      },
      setOfDocuments: {
        type: [String]
      },
      postedJobs: [{
        isJobPosted: {
          type: Boolean,
          default: false
        },
        daysRemainingForExpiring: {
          type: Number
        },
        isJobPostExpired: {
          type: Boolean,
          default: false
        },
        hideCompanyName: {
          type: Boolean,
          default: false
        },
        capability_matrix: {
          type: Object
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
          code: String,
          roles: [{
            code: String,
            name: String,
            sort_order: Number,
            capabilities: [{
              code: String,
              sort_order: Number,
              complexities: [{
                code: String,
                sort_order: Number,
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
        },
        expiringDate: {
          type: Date
        },
        releventIndustries: [{type: String}]
      }]
    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<IRecruiter>('Recruiter', RecruiterSchema.schema);
export = schema;
