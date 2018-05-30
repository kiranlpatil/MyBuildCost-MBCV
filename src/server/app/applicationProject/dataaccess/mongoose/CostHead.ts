import * as mongoose from 'mongoose';
import CostHeadModel = require('../model/project/building/CostHead');
interface CostHead extends CostHeadModel, mongoose.Document {
}
export = CostHead;
