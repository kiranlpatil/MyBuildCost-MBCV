import {Component, Input, OnChanges} from "@angular/core";
import {Candidate} from "../../../model/candidate";
import {Capability} from "../../../model/capability";
import CapabilitiesClassModel = require("../../../../../../../server/app/framework/dataaccess/model/capabilities-class.model");
import CapabilityModel = require("../../../../../../../server/app/framework/dataaccess/model/capability.model");

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-capability-portrait',
  templateUrl: 'candidate-capability-portrait.component.html',
  styleUrls: ['candidate-capability-portrait.component.css'],
})

export class CandidateCapabilityPortrait implements OnChanges {

  @Input() private candidate: Candidate;

  private showMore: boolean = false;
  private showToggleButton: boolean = false;
  private capabilities: Capability[] = new Array(0);

  ngOnChanges(): void {
    if (this.candidate.capabilities.length > 10) {
      this.capabilities = this.candidate.capabilities.slice(0, 10);
      this.showToggleButton = true;
    }
  }

}
