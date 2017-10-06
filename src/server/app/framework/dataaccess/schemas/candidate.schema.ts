import DataAccess = require('../dataaccess');
import ICandidate = require('../mongoose/candidate');
var mongoose1 = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var mongoose = require('mongoose');

class CandidateSchema {
  static get schema() {
    var schema = mongoose1.Schema({

      jobTitle: {
        type: String
      },
      roleType: {
        type: String
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
      },
      isCompleted: {
        type: Boolean,
        default: false
      },
      isSubmitted: {
        type: Boolean,
        default: false
      },
      isVisible: {
        type: Boolean,
        default: true
      },
      aboutMyself: {
        type: String
      },
      capability_matrix : {
        type : Object
      },
      certifications: [{
        name: String,
        year: Number,
        issuedBy: String,
        code: String,
        remark: String
      }],
      interestedIndustries: {
        type: [String]
      },
      awards: [{
        name: String,
        year: Number,
        issuedBy: String,
        remark: String
      }],
      industry: {
        name: String,
        code: String,
        roles: [{
          name: String,
          sort_order: Number,
          code: String,
          capabilities: [{
            code: String,
            sort_order: Number,
            complexities: [{
              code: String,
              sort_order: Number,
              scenarios: [{
                isChecked: Boolean,
                name: String,
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
                isChecked: Boolean,
                name: String,
                code: String
              }],
              name: String
            }],
            name: String
          }]
        }]
      },
      location: {
        city: String,
        state: String,
        country: String,
        pin: String
      },
      academics: [{
        schoolName: String,
        board: String,
        yearOfPassing: Number,
        specialization: String
      }],
      professionalDetails: {
        education: String,
        experience: String,
        currentSalary: String,
        noticePeriod: String,
        relocate: String,
        industryExposure: String,
        currentCompany: String,
        location: {
          city: String,
          state: String,
          country: String,
          pin: String
        },
      },
      employmentHistory: [{
        companyName: String,
        designation: String,
        isPresentlyWorking: Boolean,
        from: {
          month: String,
          year: Number
        },
        to: {
          month: String,
          year: Number
        },
        remarks: String
      }],
      proficiencies: {
        type: [String]
      },
      lockedOn: {
        type: Date
      },
      job_list: [{
        name: String,
        ids: [{
          type: String
        }]
      }],

    }, {versionKey: false});

    return schema;
  }
}
var schema = mongooseConnection.model<ICandidate>('Candidate', CandidateSchema.schema);
export = schema;
