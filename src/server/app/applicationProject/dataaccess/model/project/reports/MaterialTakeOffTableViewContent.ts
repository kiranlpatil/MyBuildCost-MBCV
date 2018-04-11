import MaterialTakeOffTableViewSubContent = require('./MaterialTakeOffTableViewSubContent');

class MaterialTakeOffTableViewContent {
  columnOne: string;
  columnTwo: string;
  columnThree: string;
  /*subContent: Map<string, MaterialTakeOffTableViewSubContent>;*/
  subContent: any;

  /*constructor(columnOne: string, columnTwo: string, columnThree: string, subContent: Map<string, MaterialTakeOffTableViewSubContent>) {
    this.columnOne = columnOne;
    this.columnTwo = columnTwo;
    this.columnThree = columnThree;
    this.subContent = subContent;
  }*/

  constructor(columnOne: string, columnTwo: string, columnThree: string, subContent: any) {
    this.columnOne = columnOne;
    this.columnTwo = columnTwo;
    this.columnThree = columnThree;
    this.subContent = subContent;
  }
}

export = MaterialTakeOffTableViewContent;
