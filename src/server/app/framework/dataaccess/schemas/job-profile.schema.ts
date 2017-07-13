import DataAccess = require("../dataaccess");
import User = require("../mongoose/user");
import ICandidate = require("../mongoose/candidate");
import ICapability = require("../mongoose/capability");
import IAcademic = require("../mongoose/academics");
import IProficiency = require("../mongoose/proficiency");
import IProfessionalDetails = require("../mongoose/professional-details");
import IEmploymentHistory = require("../mongoose/employment-history");
import IJobProfile = require("../mongoose/job-profile");
import ILocation = require("../mongoose/location");
import IDomain = require("../mongoose/domain");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class JobProfileSchema {
  static get schema() {
    var schema = mongoose.Schema({
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
      experience: {
        type: String
      },
      salary: {
        type: String
      },
      proficiencies: {
        names: [String]
      },
      mandatoryProficiencies: {
        names: [String]
      },
      industry: {
        name: String,
        roles: [{
          name: String,
          capabilities: [{
            complexities: [{
              scenarios: {
                isChecked: Boolean,
                name: String,
                code: String
              },
              name: String
            }],
            name: String
          }]
        }]
      },
      competencies: {
        type: String
      },
      isJobPosted: {
        type: Boolean,
        default: false
      },
      responsibility: {
        type: String
      },
      postingDate: {
        type: Date
      },
      interestedIndustries: [{type: String}]

    }, {versionKey: false});

    return schema;
  }
}
var schema = mongooseConnection.model<IJobProfile>("JobProfile", JobProfileSchema.schema);
export = schema;
