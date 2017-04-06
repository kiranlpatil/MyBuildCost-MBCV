import * as mongoose from "mongoose";
import ILocation = require("../mongoose/location");
interface CompanyModel {
    name: string;
    size  : number;
    logoUrl : string;
    location : any[];
}
export = CompanyModel;
