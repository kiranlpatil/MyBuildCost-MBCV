import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../../../../shared/customvalidations/validation.service';
import { Project } from '../../model/project';
import { Label } from '../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-project-form',
  templateUrl: 'project-form.component.html',
  styleUrls: ['project-form.component.css']
})

export class ProjectFormComponent implements OnInit{

  @Input() submitActionLabel: string;
  @Input() disabledName?: boolean;
  @Input() projectModel?:Project= new Project();
  @Output() onSubmitEvent = new EventEmitter<Project>();

  projectForm:  FormGroup;
  public isShowErrorMessage: boolean = false;
  public errorMessage: boolean = false;
  public imageName: string;

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
      projectDuration : ['', ValidationService.requiredProjectDuration]
    });

  }

  ngOnInit() {
   console.log(this.disabledName);
  }
  submitForm() {
    if(this.projectForm.valid) {
    this.projectModel = this.projectForm.value;
    this.projectModel.projectImage=this.imageName;
    this.projectModel.activeStatus = true;
      this.onSubmitEvent.emit(this.projectModel);
    } else {
      this.isShowErrorMessage = true;
    }
  }
  onProjectImageUpload(event:any) {
    this.imageName=event;
  }
  getLabels() {
    return Label;
  }

}
