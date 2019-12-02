import WorkItem = require('../../model/project/building/WorkItem');


class WorkItemListWithRatesDTO {
  workItems : Array<WorkItem>;
  workItemsAmount : number;
  showHideAddItemButton:boolean=true;
  gstComponent: number;

  constructor() {
    this.workItems = new Array<WorkItem>();
    this.workItemsAmount = 0;
    this.showHideAddItemButton=true;
    this.gstComponent = 0;
  }
}

export  = WorkItemListWithRatesDTO;
