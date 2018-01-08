import {Capability, SecondaryCapability} from "../../../user/models/capability";
export class Role {
  name: string = '';
  code: string ='';
  capabilities: Capability[] = new Array(0);
  default_complexities: any[] = new Array(0);
  secondaryCapabilities: SecondaryCapability[] = new Array(0);
  isAPIForComplexity: boolean = false;
  isForTest: boolean = false;
  industryCode:string;
}
