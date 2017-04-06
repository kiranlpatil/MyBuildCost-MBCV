import * as mongoose from "mongoose";
import IProficiency = require("../mongoose/proficiency");
import IDomain = require("../mongoose/domain");
import ILocation = require("../mongoose/location");

interface JobProfileModel {
    profiences :  any[];
    domain: any;
    experience : number;
    location : any;
    postingDate : Date;
    remark : string;

}
export = JobProfileModel;
