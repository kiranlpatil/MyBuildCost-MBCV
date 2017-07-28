export class CapabilityMatrixModel {

  capabilityName: string;
  capabilityPercentage: number;
  complexities: ComplexitesDataModel[];
}

export class ComplexitesDataModel {
  complexityName: string;
  scenario: string;
  status: string;
}
//export = CapabilityMatrixModel;
