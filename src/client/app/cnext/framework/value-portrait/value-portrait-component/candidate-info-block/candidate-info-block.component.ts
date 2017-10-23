import {Component, Input} from "@angular/core";
import {Candidate} from "../../../../../user/models/candidate";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-info-block',
  templateUrl: 'candidate-info-block.component.html',
  styleUrls: ['candidate-info-block.component.css'],
})

export class CandidateInfoBlock {

  @Input() candidate: Candidate;

}
