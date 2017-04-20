import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Role} from "../model/role";
import {Scenario} from "../model/scenario";
import {Complexity} from "../model/complexity";
import {Capability} from "../model/capability";

@Component({
  moduleId: module.id,
  selector: 'cn-complexity-list',
  templateUrl: 'complexity-list.component.html',
  styleUrls: ['complexity-list.component.css']
})

export class ComplexityListComponent {

  @Input() roles:Role[] = new Array(0);
  @Input() candidateRoles:Role[] = new Array();
  @Output() selectComplexityWithRole = new EventEmitter();
  private scenarioNames:string[] = new Array(0);
  private scenaricomplexityNames:string[] = new Array(0);
  private selectedComplexityNames:string[]=new Array(0);
  private numberOfComplexitySelected:number = 0;
  private isComplexityButtonEnable:boolean = false;
  @Input() isComplexityPresent : boolean=false;
  private showModalStyle:boolean = false;

  ngOnChanges(changes:any) {
    if (changes.roles) {
      this.roles = changes.roles.currentValue;
    }
    if (this.candidateRoles) {
      this.scenarioNames = new Array(0);
      for (let role of this.candidateRoles) {
        if (role.capabilities) {
          for (let primary of role.capabilities) {
            if (primary.complexities) {
              for (let complexity of primary.complexities) {
                this.scenarioNames.push(complexity.name);
              }
            }
          }
        }
      }
    }

    if (this.roles) {
      this.scenaricomplexityNames = new Array(0);
      for (let role of this.roles) {
        if (role.capabilities) {
          for (let primary of role.capabilities) {
            if (primary.complexities) {
              for (let complexity of primary.complexities) {
                this.scenaricomplexityNames.push(complexity.name);
              }
            }
          }
        }
      }
    }
  }

  selectComplexity(role:Role, capability :Capability,complexity:Complexity, selectedScenario:Scenario, event:any) {
    for(let rol  of this.candidateRoles){
        for(let cap of rol.capabilities){
          if(cap.name==capability.name){
            capability.isPrimary=cap.isPrimary;
            capability.isSecondary=cap.isSecondary;
          }
        }
    }
    for (let item of complexity.scenarios) {
      item.isChecked = false;
    }
    selectedScenario.isChecked = true;
    if(this.selectedComplexityNames.indexOf(complexity.name)===-1){
      this.selectedComplexityNames.push(complexity.name);
    }
    //event.target.checked ? this.numberOfComplexitySelected++ : this.numberOfComplexitySelected--;
    if (this.selectedComplexityNames.length === this.scenaricomplexityNames.length) {
      this.isComplexityButtonEnable =true;
    }
  }

  saveComplexity(){
    this.isComplexityButtonEnable =false;
    this.showModalStyle = !this.showModalStyle;
    for(let rol  of this.candidateRoles){
      for(let mainrol of this.roles){
        if(rol.name = mainrol.name){
          for(let cap of rol.capabilities){
            if(cap.isSecondary){
              mainrol.capabilities.push(cap);
            }
          }
        }
      }
    }
    this.selectComplexityWithRole.emit(this.roles);
  }

  getStyleModal() {
    return this.showModalStyle?'block':'none';
  }

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }
}
