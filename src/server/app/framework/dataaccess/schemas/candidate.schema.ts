import DataAccess = require("../dataaccess");
import User = require("../mongoose/user");
import ICandidate = require("../mongoose/candidate");
import ICapability = require("../mongoose/capability");
import IComplexity = require("../mongoose/complexity");
import IAcademic = require("../mongoose/academics");
import ICertification = require("../mongoose/certification");
import IProficiency = require("../mongoose/proficiency");
import IProfessionalDetails = require("../mongoose/professional-details");
import IEmploymentHistory = require("../mongoose/employment-history");
import IJobProfile = require("../mongoose/job-profile");
import ILocation = require("../mongoose/location");
import IRole = require("../mongoose/role");
import IIndustry = require("../mongoose/industry");
var mongoose1 = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var mongoose = require('mongoose');

class CandidateSchema {
  static get schema() {
    var schema = mongoose1.Schema({

     userId :{
       type : mongoose.Schema.Types.ObjectId, ref :'User'
     },
      isVisible :{
        type : Boolean
      },
      capabilities : [{type : mongoose.Schema.Types.ObjectId, ref :'ICapability'}],
      roles : [{type : mongoose.Schema.Types.ObjectId, ref :'IRole'}],
      industry : [{type : mongoose.Schema.Types.ObjectId, ref :'IIndustry'}],
      location : {type : mongoose.Schema.Types.ObjectId, ref :'ILocation'},
      academics :[{type : mongoose.Schema.Types.ObjectId, ref :'IAcademic'}],
      complexities :[{type : mongoose.Schema.Types.ObjectId, ref :'IComplexity'}],
      certifications :[{type : mongoose.Schema.Types.ObjectId, ref :'ICertification'}],
      professionalDetails :[{type : mongoose.Schema.Types.ObjectId, ref :'IProfessionalDetails'}],
      employmentHistories  :[{type : mongoose.Schema.Types.ObjectId, ref :'IEmploymentHistory'}],
      appliedjobs :[{type : mongoose.Schema.Types.ObjectId, ref :'IJobProfile'}],
      proficiences :[{type : mongoose.Schema.Types.ObjectId, ref :'IProficiency'}]

    },{ versionKey: false });

    return schema;
  }
}
var schema = mongooseConnection.model<ICandidate>("Candidate", CandidateSchema.schema);
export = schema;
