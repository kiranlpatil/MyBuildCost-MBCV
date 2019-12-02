class MaterialTakeOffFlatDetailsDTO {
  buildingName: string;
  costHeadName: string;
  categoryName: string;
  workItemName: string;
  materialName: string;
  quantityName: string;
  quantity: number;
  unit: string;
  gst: number;
  rate: any;

  constructor(buildingName: string, costHeadName: string, categoryName: string, workItemName: string, materialName: string,
              quantityName: string, quantity: number, unit: string, gst: number, rate?: any) {
    this.buildingName = buildingName;
    this.costHeadName = costHeadName;
    this.categoryName = categoryName;
    this.workItemName = workItemName;
    this.materialName = materialName;
    this.quantityName = quantityName;
    this.quantity = quantity;
    this.unit = unit;
    this.gst = gst;
    this.rate = rate;
  }
}

export = MaterialTakeOffFlatDetailsDTO;
