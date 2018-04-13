import MaterialTakeOffSecondaryView = require('./MaterialTakeOffSecondaryView');

class MaterialTakeOffReport {
   header: string;
   /*secondaryView: Map<string, MaterialTakeOffSecondaryView>;*/
  secondaryView: any;

   /*constructor(header: string, secondaryView: Map<string, MaterialTakeOffSecondaryView>) {
     this.header = header;
     this.secondaryView = secondaryView;
   }*/

  constructor(header: string, secondaryView: any) {
    this.header = header;
    this.secondaryView = secondaryView;
  }
}

export = MaterialTakeOffReport;
