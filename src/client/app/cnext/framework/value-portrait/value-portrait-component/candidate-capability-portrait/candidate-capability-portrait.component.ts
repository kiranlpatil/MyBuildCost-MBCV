import {Component, Input, OnChanges} from "@angular/core";
import {Candidate} from "../../../../../user/models/candidate";
import {Capability} from "../../../../../user/models/capability";
import {Label} from "../../../../../shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-capability-portrait',
  templateUrl: 'candidate-capability-portrait.component.html',
  styleUrls: ['candidate-capability-portrait.component.css'],
})

export class CandidateCapabilityPortrait implements OnChanges {

  @Input() candidate: Candidate;

  private showMore: boolean = false;
  showToggleButton: boolean = false;
  private capabilities: Capability[] = new Array(0);
  innerWidth: Number;
  isClickEnable: boolean = false;

  ngOnChanges(): void {
    this.innerWidth = window.screen.width;

    if (this.innerWidth <= 768) {
      this.isClickEnable = true;
    }

    if (this.candidate.capabilities.length > 10 && this.innerWidth >= 768) {
      this.capabilities = this.candidate.capabilities.slice(0, 10);
      this.showToggleButton = true;
    }
  }

  getLabel() {
    return Label;
  }

}
