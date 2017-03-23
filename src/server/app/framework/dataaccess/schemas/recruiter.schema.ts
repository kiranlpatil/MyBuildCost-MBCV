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
          }
        },{ versionKey: false });

        return schema;
    }
}
var schema = mongooseConnection.model<IRecruiter>("Recruiter", RecruiterSchema.schema);
export = schema;
