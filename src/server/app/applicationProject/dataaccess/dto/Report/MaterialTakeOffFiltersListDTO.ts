class MaterialTakeOffFiltersListDTO {
  buildingList: Array<string>;
  costHeadList: Array<string>;
  materialList: Array<string>;

  constructor(buildingList: Array<string>, costHeadList: Array<string>, materialList: Array<string>) {
    this.buildingList = buildingList;
    this.costHeadList = costHeadList;
    this.materialList = materialList;


  }
}
export = MaterialTakeOffFiltersListDTO;
