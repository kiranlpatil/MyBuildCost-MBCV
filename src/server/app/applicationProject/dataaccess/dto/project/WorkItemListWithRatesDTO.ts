import WorkItem = require('../../model/project/building/WorkItem');


class WorkItemListWithRatesDTO {
  workItems : Array<WorkItem>;
  workItemsAmount : number;

  constructor() {
    this.workItems = new Array<WorkItem>();
    this.workItemsAmount = 0;
  }
}

export  = WorkItemListWithRatesDTO;
