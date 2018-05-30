import MaterialTakeOffTableViewHeaders = require('./MaterialTakeOffTableViewHeaders');
import MaterialTakeOffTableViewFooter = require('./MaterialTakeOffTableViewFooter');
import MaterialTakeOffTableViewContent = require('./MaterialTakeOffTableViewContent');

class MaterialTakeOffTableView {
  header: MaterialTakeOffTableViewHeaders;
  //content: Map<string, MaterialTakeOffTableViewContent>;
  content: MaterialTakeOffTableViewContent;
  footer: MaterialTakeOffTableViewFooter;

  /*constructor(headers: MaterialTakeOffTableViewHeaders, content: Map<string, MaterialTakeOffTableViewContent>,
              footer: MaterialTakeOffTableViewFooter) {
    this.headers = headers;
    this.content = content;
    this.footer = footer;
  }*/

  constructor(headers: MaterialTakeOffTableViewHeaders, content: MaterialTakeOffTableViewContent,
              footer: MaterialTakeOffTableViewFooter) {
    this.header = headers;
    this.content = content;
    this.footer = footer;
  }
}

export = MaterialTakeOffTableView;
