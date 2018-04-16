import MaterialTakeOffView = require('./MaterialTakeOffView');

class MaterialTakeOffTableViewContent extends MaterialTakeOffView {
  /*subContent: Map<string, MaterialTakeOffTableViewSubContent>;*/
  subContent: any;

  /*constructor(columnOne: string, columnTwo: string, columnThree: string, subContent: Map<string, MaterialTakeOffTableViewSubContent>) {
    this.columnOne = columnOne;
    this.columnTwo = columnTwo;
    this.columnThree = columnThree;
    this.subContent = subContent;
  }*/

  constructor(columnOne: string, columnTwo: string, columnThree: string, subContent: any) {
    super(columnOne, columnTwo, columnThree);
    this.subContent = subContent;
  }
}

export = MaterialTakeOffTableViewContent;
