import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Role } from '../model/role';
import { Scenario } from '../model/scenario';
import { Complexity } from '../model/complexity';
import { Capability } from '../model/capability';
import { ComplexityService } from '../complexity.service';
import { LocalStorageService } from '../../../framework/shared/localstorage.service';
import { LocalStorage } from '../../../framework/shared/constants';
import { Section } from '../model/candidate';

@Component({
  moduleId: module.id,
  selector: 'cn-complexities',
  templateUrl: 'complexities.component.html',
  styleUrls: ['complexities.component.css']
})

export class ComplexitiesComponent {

  @Input() roles:Role[] = new Array(0);
  @Input() candidateRoles:Role[] = new Array();
  private roleWithDefaultComplexity:Role[] = new Array();
  @Output() onComplete = new EventEmitter();
  @Input() isComplexityPresent:boolean = true;
  @Input() highlightedSection:Section;


  private scenarioNames:string[] = new Array(0);
  private selectedScenarioNames:string[] = new Array(0);
  //private scenaricomplexityNames:string[] = new Array(0);
  private selectedComplexityNames:string[] = new Array(0);
  //private selectedDefaultComplexityNames:string[] = new Array(0);
  private isComplexityButtonEnable:boolean = false;
  private showModalStyle:boolean = false;
  private isCandidate:boolean = false;
  private showMore:boolean = false;
  private isPresentCapabilityCandidate:boolean = false;
  private isPresentCapability:boolean = false;
  private isPresentDefaultComplexity:boolean = false;
  private isPresentDefaultComplexityCandidate:boolean = false;
  private count:number = 0;
 // private elements:any;
  tooltipCandidateMessage:string = "<ul><li>" +
    "<h5>Complexities</h5><p class='info'> This section provides a list of complexity scenarios for your selected capabilities." +
      "For each scenario, select the most appropriate level of complexity that you are capable of handling.</p></li>" +
      "<li><p>If you have not handled a particular complexity, choose not applicable.</p>" +
    "</li></ul>";

  tooltipRecruiterMessage:string = "<ul><li>" +
      "<h5>Complexities</h5><p class='info'> This section provides a list of complexity scenarios for selected capabilities." +
      "For each scenario, select the most appropriate level of complexity that candidates are required to be capable of handling.</p></li>" +
      "<li><p>If you have not handled a particular complexity, choose not applicable.</p>" +
      "</li></ul>";


  @ViewChild("save")
  private _inputElement1:ElementRef;

  constructor(private complexityService:ComplexityService) {
  }

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
  }
  ngOnDestroy(){
    this.selectedScenarioNames=new Array();
  }

  ngOnChanges(changes:any) {debugger
    this.roleWithDefaultComplexity=new Array();
    this.selectedScenarioNames=new Array();
    this.isPresentCapability=false;
    this.isPresentDefaultComplexity=false;
    this.isPresentCapabilityCandidate=false;
    this.isPresentDefaultComplexityCandidate=false;

    if (changes.roles) {
      this.roles = changes.roles.currentValue;
    }

    if (this.roles) {
      for (let role of this.roles) {
        if (role.capabilities) {
          for (let primary of role.capabilities) {
            if (primary.complexities) {
              this.isPresentCapability=true;
              for (let complexity of primary.complexities) {
                this.scenarioNames.push(complexity.name);
              }
            }
          }
        }
        if (role.default_complexities) {
          for (let primary of role.default_complexities) {
            if (primary.complexities) {
              for (let complexity of primary.complexities) {
                this.isPresentDefaultComplexity=true;
                this.scenarioNames.push(complexity.name);
              }
            }
          }
        }
      }
    }

    if (this.candidateRoles) {
      for (let role of this.candidateRoles) {
        if (role.capabilities) {
          for (let primary of role.capabilities) {
            if (primary.complexities) {
              for (let complexity of primary.complexities) {
                this.isPresentCapabilityCandidate=true;
                this.isPresentCapability=false;
                this.selectedScenarioNames.push(complexity.name);
              }
            }
          }
        }
        if (role.default_complexities) {
          for (let primary of role.default_complexities) {
            if (primary.complexities) {
              for (let complexity of primary.complexities) {
                this.isPresentDefaultComplexityCandidate=true;
                this.isPresentDefaultComplexity=false;
                this.selectedScenarioNames.push(complexity.name);
              }
            }
          }
        }
      }
    }


    // if(this.scenarioNames.length>0){
    //   this.compactView=true;
    // }
    // else{
    //   this.compactView=false;
    // }

  }

  selectDefaultComplexity(role:Role, complexity:Complexity, selectedScenario:Scenario, event:any) {
    debugger

    for (let item of complexity.scenarios) {

      item.isChecked = false;
    }

    selectedScenario.isChecked = true;
    if (this.selectedComplexityNames.indexOf(complexity.name) === -1) {
      this.selectedComplexityNames.push(complexity.name);
    }

    this.roleWithDefaultComplexity.push(role);
  }

  selectComplexity(role:Role, capability:Capability, complexity:Complexity, selectedScenario:Scenario, event:any) {
    debugger
    for (let rol  of this.candidateRoles) {
      debugger
      for (let cap of rol.capabilities) {
        if (cap.name == capability.name) {
          capability.isPrimary = cap.isPrimary;
          capability.isSecondary = cap.isSecondary;
        }
      }
    }
    let isFound:boolean = false;
    for (let item of complexity.scenarios) {
      if (item.isChecked) {
        isFound = true;
      }
      item.isChecked = false;
    }
    if (!isFound) {
      this.selectedScenarioNames.push(complexity.name);
      this.count++;
    }
    selectedScenario.isChecked = true;
    if (this.selectedComplexityNames.indexOf(complexity.name) === -1) {
      this.selectedComplexityNames.push(complexity.name);
    }

  }


  saveComplexity() {debugger
    //this.compactView=true
    this.isComplexityButtonEnable = false;
    if (this.isCandidate) {
      this.showModalStyle = !this.showModalStyle;
      this.highlightedSection.isLocked = true;
    }
    this.complexityService.change(true);
    for (let rol  of this.candidateRoles) {
      for (let mainrol of this.roles) {
        if (rol.name === mainrol.name) {
          if (rol.capabilities) {
            for (let cap of rol.capabilities) {
              if (mainrol.capabilities) {
                for (let mainCap of mainrol.capabilities) {
                  if (mainCap.name === cap.name) {
                    if (cap.isSecondary) {
                      mainCap.isSecondary = true;
                      mainCap.isPrimary = false;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if(this.roleWithDefaultComplexity.length>0){
      for (let role of this.roleWithDefaultComplexity) {
        for (let mainRole of this.roles) {
          if (role.name === mainRole.name) {
            mainRole.default_complexities = role.default_complexities;
          }
        }
      }}
    if (this.highlightedSection.isProficiencyFilled) {
      this.highlightedSection.name = "none";
    } else {
      this.highlightedSection.name = "Proficiencies";
    }
    this.highlightedSection.isDisable = false;

    this.onComplete.emit(this.roles);
  }

  getStyleModal() {
    if (this.showModalStyle) {
      this._inputElement1.nativeElement.focus();
      return 'block';
    } else {
      this._inputElement1.nativeElement.focus();
      return 'none';
    }
  }

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }
  edit()
  {
    this.highlightedSection.name='Complexities';
 this.highlightedSection.isDisable=true;
    this.roles = this.candidateRoles;
this.showMore=false;


  }
}
