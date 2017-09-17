import {Complexity} from "./complexity";
export class Capability {
  name: string = '';
  complexities: Complexity[] = new Array(0);
  isPrimary: boolean = false;
  isSecondary: boolean = false;
  isFound : boolean = false;
  code: string = '';
}

export class SecondaryCapability {
  name: string = '';
  complexities: Complexity[] = new Array(0);
}
export class DefaultComplexities {
  name: string = '';
  complexities: Complexity[] = new Array(0);
}
