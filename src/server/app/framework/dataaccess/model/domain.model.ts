import * as mongoose from "mongoose";
import IRole = require("../mongoose/role");

interface DomainModel {
    names: string;
    roles : any[];

}
export = DomainModel;
