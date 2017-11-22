import * as mongoose from "mongoose";

interface UsageTrackingModel extends mongoose.Document {
  recruiterId: string;
  candidateId: string;
  jobProfileId: string;
  action: number;
  timestamp: Date;
}

export = UsageTrackingModel;
