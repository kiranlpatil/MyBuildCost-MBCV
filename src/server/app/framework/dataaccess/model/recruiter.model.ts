import * as mongoose from "mongoose";
import User = require("../mongoose/user");
import JobProfileModel = require("./jobprofile.model");
interface RecruiterModel {
    isRecruitingForself : boolean;
    comapny_name : string;
    company_size : string;
    company_logo: string;
    company_headquarter_country : string;
    userId :  any;
    postedJobs : JobProfileModel[];
}
export = RecruiterModel;
