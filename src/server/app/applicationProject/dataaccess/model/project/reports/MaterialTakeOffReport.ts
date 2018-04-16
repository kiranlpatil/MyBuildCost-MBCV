import MaterialTakeOffSecondaryView = require('./MaterialTakeOffSecondaryView');

class MaterialTakeOffReport {
   title: string;
   /*secondaryView: Map<string, MaterialTakeOffSecondaryView>;*/
  secondaryView: any;

   /*constructor(header: string, secondaryView: Map<string, MaterialTakeOffSecondaryView>) {
     this.header = header;
     this.secondaryView = secondaryView;
   }*/

  constructor(header: string, secondaryView: any) {
    this.title = header;
    this.secondaryView = secondaryView;
  }
}

export = MaterialTakeOffReport;
