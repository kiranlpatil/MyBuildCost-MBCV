import * as mongoose from "mongoose";
import IProficiency = require("../mongoose/proficiency");
import IDomain = require("../mongoose/domain");
import ILocation = require("../mongoose/location");
import LocationModel = require("./location.model");
import ProficiencyModel = require("./proficiency.model");
import IndustryModel = require("./industry.model");

interface JobProfileModel {
    jobTitle : string;
    hiringManager : string;
    department : string;
    education : string;
    experience : string;
    salary : string;
    joiningPeriod :string;
    profiences :  ProficiencyModel;
    industry : IndustryModel;
    location : LocationModel;
    competencies : string;
    responsibility : string;
    postingDate : Date;
    remark : string;
    interestedIndustry : string[];

}
export = JobProfileModel;
