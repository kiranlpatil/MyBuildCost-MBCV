export class MaterialTakeOffFilters {
  elementWiseReport : string;
  element : string;
  building : string;

  constructor(elementWiseReport : string, element : string, building : string) {
    this.elementWiseReport = elementWiseReport;
    this.element = element;
    this.building = building;
  }
}
