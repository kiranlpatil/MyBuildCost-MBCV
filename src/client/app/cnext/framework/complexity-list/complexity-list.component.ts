import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Role} from "../model/role";
import {Scenario} from "../model/scenario";

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
  private numberOfComplexitySelected:number = 0;

  ngOnChanges(changes:any) {debugger
    if (changes.roles) {
      this.roles = changes.roles.currentValue;
    }
    if (this.candidateRoles) {
      this.scenarioNames= new Array(0);
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

  selectComplexity(selectedScenario:Scenario, event:any) {
    selectedScenario.isChecked = true;
    event.target.checked ? this.numberOfComplexitySelected++ : this.numberOfComplexitySelected--;
    if (this.numberOfComplexitySelected >= this.scenaricomplexityNames.length) {debugger
      this.selectComplexityWithRole.emit(this.roles);
    }
  }

}
