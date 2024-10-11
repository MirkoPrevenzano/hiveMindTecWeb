import { Component,Inject, Optional , Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RestBackendService } from '../_service/rest-backend/rest-backend.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Validators, Editor, Toolbar, NgxEditorModule } from 'ngx-editor';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifyService } from '../_service/notify/notify.service';

@Component({
	selector: 'app-idea-form',
	standalone: true,
	imports: [ReactiveFormsModule,NgxEditorModule],
	templateUrl: './idea-form.component.html',
	styleUrl: './idea-form.component.scss'
})

  export class IdeaFormComponent {
  @Output() formEmit = new EventEmitter<void>();

  editor: Editor;
 
  toolbar: Toolbar = [
    ['bold', 'italic','underline', 'strike'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['undo', 'redo']
  ];


  ideaForm: FormGroup;
  restService = inject(RestBackendService);
  router= inject(Router);
  isEditModeLocal: boolean = false;
  formBuilder= inject(FormBuilder);


  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public dataUpdate: { idIdeaUpdate: number, isEditMode: boolean }, private notifyService:NotifyService) { }

 
  
  ngOnInit(): void {
    

    this.editor = new Editor({history: true, content: '',keyboardShortcuts: true});
    this.ideaForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
    

    
    this.checkUpdateMode();
    
  }

  private checkUpdateMode() {
    if (this.dataUpdate) {
      this.isEditModeLocal = this.dataUpdate.isEditMode;
      if (this.isEditModeLocal) {
        this.loadIdea(this.dataUpdate.idIdeaUpdate);
      }
    }
  }
  
  removeHtmlTags(text: string): string {
    return text.replace(/<[^>]*>/g, '');
  }
  
 
  
  loadIdea(id: number): void {
    this.restService.getIdeaById(id).subscribe({
      next: (idea) => {
        this.ideaForm.patchValue({
          title: idea.title,
          description: idea.description
        });
      },
      error: (error) => {
        this.notifyService.openSnackBar(error.error, "Close", "snackBarError");
      }
    });
  }

  
  onSubmit() {
    if(this.isEditModeLocal) {
      this.updateIdea();
    }
    else {
      this.addIdea();
    }
  }


  private isValidFormIdea(): boolean {
    return this.ideaForm.invalid || this.ideaForm.value.title === ''|| this.ideaForm.value.description === '<p></p>';
  }


  updateIdea() {
    const maxLength = 400; 
    const textWithoutHtml = this.removeHtmlTags(this.ideaForm.value.description!); 

    if (this.isValidFormIdea()){this.notifyService.openSnackBar("Please fill in all fields", "Close", "snackBarWarning");}

    else  if (textWithoutHtml.length > maxLength) {
      this.notifyService.openSnackBar("The description must be less than ${maxLength} characters or empty.", "Close", "snackBarWarning");
    } 
      
    else {
      let title=this.ideaForm.value.title as string;
      let description= this.ideaForm.value.description as string
      this.restService.updateIdea(this.dataUpdate.idIdeaUpdate, title, description).subscribe({
        error: (err) => {
            this.notifyService.openSnackBar(err.error, "Close", "snackBarError");
        },
        complete: () => {
          this.notifyService.openSnackBar("Idea updated successfully", "Close", "snackBarSuccess");
          this.formEmit.emit();
        }
      });
    }

  }


  addIdea() {
    const maxLength = 400; 
    const textWithoutHtml = this.removeHtmlTags(this.ideaForm.value.description!); 
  
    if (this.isValidFormIdea()){this.notifyService.openSnackBar("Please fill in all fields", "Close", "snackBarWarning");}

    else  if (textWithoutHtml.length > maxLength) {
      this.notifyService.openSnackBar("The description must be less than 400 characters or empty.", "Close", "snackBarWarning");      
    }
    else {
      
      this.restService.createIdea({
        title: this.ideaForm.value.title as string,
        description: this.ideaForm.value.description as string
      }).subscribe({
        error: (err) => {
            this.notifyService.openSnackBar(err.error, "Close", "snackBarError");
            this.ideaForm.reset();
        },
        complete: () => {
          this.notifyService.openSnackBar("Idea added successfully", "Close", "snackBarSuccess");
        }});
    }
  }

  
  
}


