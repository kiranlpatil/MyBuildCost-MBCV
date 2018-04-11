import MaterialTakeOffTableView = require('./MaterialTakeOffTableView');

class MaterialTakeOffSecondaryView {
  header: string;
  table: MaterialTakeOffTableView;

  constructor(header: string, table: MaterialTakeOffTableView) {
    this.header = header;
    this.table = table;
  }
}

export  = MaterialTakeOffSecondaryView;
