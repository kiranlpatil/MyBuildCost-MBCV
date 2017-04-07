import DataAccess = require("../dataaccess");
import User = require("../mongoose/user");
import IRecruiter = require("../mongoose/recruiter");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class RecruiterSchema {
    static get schema() {
        var schema = mongoose.Schema({
          userId : {
            type : mongoose.Schema.Types.ObjectId, ref :'User'
          },
          "comapny_name":{
            type:String
          },
          "company_size":{
            type:String
          },
          "company_logo":{
            type:String
          },
          "company_headquarter_country":{
            type:String
          },
          postedJobs:[{
            jobTitle :{
              type : String
            },
            hiringManager :{
              type : String
            },
            department :{
              type : String
            },
            education :{
              type : String
            },
            experience :{
              type : String
            },
            salary :{
              type : String
            },
            profiences :{
              names : [String]
            },
            industry:{
              name:String,
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
            competencies :{
              type : String
            },
            responsibility :{

              type : String
            },
            postingDate :{
              type : Date
            }
          }]
        },{ versionKey: false });

        return schema;
    }
}
var schema = mongooseConnection.model<IRecruiter>("Recruiter", RecruiterSchema.schema);
export = schema;
