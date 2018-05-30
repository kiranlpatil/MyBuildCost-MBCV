import MaterialTakeOffTableView = require('./MaterialTakeOffTableView');

class MaterialTakeOffSecondaryView {
  title: string;
  table: MaterialTakeOffTableView;

  constructor(header: string, table: MaterialTakeOffTableView) {
    this.title = header;
    this.table = table;
  }
}

export  = MaterialTakeOffSecondaryView;
