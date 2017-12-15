import DataAccess = require('../dataaccess');
import IJobProfile = require('../mongoose/job-profile');
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class JobProfileSchema {
  static get schema() {
    var schema = mongoose.Schema({
        recruiterId : {
          type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter',
          required: true,
        },
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
        isJobPostClosed: {
          type: Boolean,
          default: false
        },
        isJobShared: {
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
        complexity_musthave_matrix: {
          type: Object
        },
        jobCloseReason:{
          type: Number
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
        sharedLink: {
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
      educationForJob: [{
        educationDegree:String,
        specialization: String,
        _id: false
      }],
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
      }, {versionKey: false});

    return schema;
  }
}
var schema = mongooseConnection.model<IJobProfile>('JobProfile', JobProfileSchema.schema);
export = schema;
