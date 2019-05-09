import MaterialTakeOffView = require('./MaterialTakeOffView');

class MaterialTakeOffTableViewContent extends MaterialTakeOffView {
  /*subContent: Map<string, MaterialTakeOffTableViewSubContent>;*/
  subContent: MaterialTakeOffTableViewContent;

  /*constructor(columnOne: string, columnTwo: string, columnThree: string, subContent: Map<string, MaterialTakeOffTableViewSubContent>) {
    this.columnOne = columnOne;
    this.columnTwo = columnTwo;
    this.columnThree = columnThree;
    this.subContent = subContent;
  }*/

  constructor(columnOne: string, columnTwo: any, columnThree: string, columnFour: any, subContent: MaterialTakeOffTableViewContent) {
    super(columnOne, columnTwo, columnThree, columnFour);
    this.subContent = subContent;
  }
}

export = MaterialTakeOffTableViewContent;
