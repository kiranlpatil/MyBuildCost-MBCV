import * as mongoose from "mongoose";
import User = require("../mongoose/user");
interface RecruiterModel {
    isRecruitingForself : boolean;
    comapny_name : string;
    company_size : string;
    company_logo: string;
    userId :  any[];
}
export = RecruiterModel;
