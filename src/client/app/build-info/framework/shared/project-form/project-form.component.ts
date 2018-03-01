import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../../../../shared/customvalidations/validation.service';
import { Project } from '../../model/project';
import { Label } from '../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-project-form',
  templateUrl: 'project-form-component.html'
})

export class ProjectFormComponent {

  @Input() submitActionLabel: string;
  @Input() projectModel?:Project= new Project();
  @Output() onSubmitEvent = new EventEmitter<Project>();

  projectForm:  FormGroup;
  public isShowErrorMessage: boolean = true;
  public errorMessage: boolean = false;

  constructor( private formBuilder: FormBuilder) {

    this.projectForm = this.formBuilder.group({
      name : ['', ValidationService.requiredProjectName],
      region : ['', ValidationService.requiredProjectAddress],
      plotArea : ['', ValidationService.requiredPlotArea],
      plotPeriphery : ['', ValidationService.requiredPlotPeriphery],
      podiumArea : ['',ValidationService.requiredPodiumArea],
      openSpace : ['', ValidationService.requiredOpenSpace],
      slabArea : ['',ValidationService.requiredSlabArea],
      poolCapacity : ['',ValidationService.requiredSwimmingPoolCapacity],
      projectDuration : ['', ValidationService.requiredProjectDuration],
      totalNumOfBuildings : ['', ValidationService.requiredNumOfBuildings]
    });

  }

  submitForm() {
    if(this.projectForm.valid) {
    this.projectModel = this.projectForm.value;
      this.onSubmitEvent.emit(this.projectModel);
    }
  }

  getLabels() {
    return Label;
  }

}
