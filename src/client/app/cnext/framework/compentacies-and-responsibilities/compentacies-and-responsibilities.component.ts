import {Component, Output, Input,EventEmitter} from "@angular/core";
import {Section} from "../model/candidate";
import {isUndefined} from "util";
import {JobPosterModel} from "../model/jobPoster";

@Component({
  moduleId: module.id,
  selector: 'cn-compentacies-and-responsibilities',
  templateUrl: 'compentacies-and-responsibilities.component.html',
  styleUrls: ['compentacies-and-responsibilities.component.css']
})

export class CompentansiesAndResponsibilitiesComponent  {
  @Input() jobPosterModel:JobPosterModel;
  @Input() highlightedSection:Section;
  @Output() onComplete = new EventEmitter();
  
  onCompetenciesComplete(data:string) {
    this.jobPosterModel.competencies = data;
    this.onComplete.emit(this.jobPosterModel);
  }

  onResponsibilitiesComplete(data:string) {
    this.jobPosterModel.responsibility = data;
    this.onComplete.emit(this.jobPosterModel);
  }
}
