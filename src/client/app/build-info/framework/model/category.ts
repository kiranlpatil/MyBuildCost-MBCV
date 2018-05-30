import { WorkItem } from './work-item';

export class  Category {
  name: string;
  rateAnalysisId: number;
  amount: number;
  active: boolean;
  workItems : Array<WorkItem>;

  constructor(name: string, rateAnalysisId: number) {
    this.name = name;
    this.rateAnalysisId = rateAnalysisId;
    this.amount = 0;
    this.workItems = new Array<WorkItem>();
  }
}

