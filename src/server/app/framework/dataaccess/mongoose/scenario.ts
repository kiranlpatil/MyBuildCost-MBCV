import * as mongoose from "mongoose";
import ScenarioModel = require("../model/scenario.model");
interface IScenario extends ScenarioModel, mongoose.Document {
}
export = IScenario;
