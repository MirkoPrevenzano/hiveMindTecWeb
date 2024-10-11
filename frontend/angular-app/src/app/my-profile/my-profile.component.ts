import { Component } from '@angular/core';
import { IdeaComponent } from '../idea-page/idea/idea.component';
import { IdeaFormComponent } from '../idea-form/idea-form.component';
import { RestBackendService } from '../_service/rest-backend/rest-backend.service';
import { IdeaRequest } from '../_service/rest-backend/typeModel/idea-request.type';
import { HostListener } from '@angular/core';
import { AuthService } from '../_service/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { NotFoundComponent } from '../not-found/not-found.component';
import{MatDialog} from '@angular/material/dialog';
import{MatSnackBar} from '@angular/material/snack-bar';
import { NotifyService } from '../_service/notify/notify.service';
@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [IdeaComponent, IdeaFormComponent, CommonModule,NotFoundComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent {
  constructor(private restService: RestBackendService,  private authService:AuthService, private route: ActivatedRoute, private snackBar:MatSnackBar, public dialog:MatDialog,public notifyService:NotifyService) {}


  ideas: IdeaRequest[] = [];
  limit: number = 10;
  currentPage: number = 1;
  username: string = '';
  error404: boolean = false;
  private isPageLoaded: boolean = false;
  private deleteTimeout: any;
  private deletedIdea: IdeaRequest;
  private isUpdateSuccess: boolean = false;


  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.username = params['username'];
      this.restService.isUsernameValid(this.username).subscribe((data) => {
        if (data) 
          this.getPersonalIdea();
        else
          this.error404 = true;
      });
    });
  }

  
  ngAfterViewInit() {
    this.isPageLoaded = true;
  }

  private handleNewIdeas(data: IdeaRequest[]): void {
    const newIdeas = data.filter(idea => !this.ideas.some(existingIdea => existingIdea.id === idea.id));
    this.ideas = [...this.ideas, ...newIdeas]; 
  }


  private handleError(err: any): void {
    if (err.status === 404) {
      this.error404 = true;
    } else if(err.status>=500&&err.status<600){
      this.notifyService.openSnackBar(err.error, "Close", "snackbarErrorServer");
    }
  }


  isLogin(){  return this.authService.isAuthenticated() && this.authService.getUser()===this.username; } 

  
  getPersonalIdea(): void {
    if (this.username) {
      this.restService.getPersonalIdea(this.currentPage, this.limit, this.username).subscribe(
        (data: IdeaRequest[]) => this.handleNewIdeas(data),
        (err) => this.handleError(err),
      );
    }
  }


  

  loadMoreIdeas() {
    this.currentPage++; // Incrementa la pagina corrente
    this.getPersonalIdea(); // Richiede il set successivo di idee
  }

   
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.isPageLoaded) {
      const pos = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
      const max = document.documentElement.scrollHeight;
      if (pos === max) {
        this.loadMoreIdeas();
      }
    }
  }


  updateIdea(id?: number) {
    const ideaIndex = this.ideas.findIndex(idea => idea.id === id);
    if(id!==undefined&&ideaIndex!==-1){
      const dialogRef = this.dialog.open(IdeaFormComponent, {
        minWidth:"50vw" ,
        minHeight:"24vh",
        maxHeight:"80vh",
        disableClose: false, 
        hasBackdrop: true, 
        autoFocus: true, 
        data: {
          idIdeaUpdate:id, 
          isEditMode: true
        }
      });
      
      dialogRef.componentInstance.formEmit.subscribe(() => {
        this.isUpdateSuccess = true;
        dialogRef.close();
      });

      dialogRef.afterClosed().subscribe(() => {
        if (this.isUpdateSuccess) {
          this.ideas = [];
          this.currentPage = 1;
          this.getPersonalIdea(); 
          this.notifyService.openSnackBar("Idea successfully modified.", "Close", "snackBarSuccess");
          this.isUpdateSuccess = false;
        }
      });
    }
    else  this.notifyService.openSnackBar("Error in updating the idea", "Close", "snackBarError");
    
  }

  deleteIdea(id?: number) {
    const ideaIndex = this.ideas.findIndex(idea => idea.id === id);

    if(id!==undefined&&ideaIndex!==-1){
      this.deletedIdea = this.ideas[ideaIndex];
      this.ideas.splice(ideaIndex, 1);
      const snackBarRef = this.snackBar.open('Idea has been successfully removed', 'Undo', {
        duration: 3000, 
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbarSuccess']
      });

      this.deleteTimeout = setTimeout(() => {
        this.restService.deleteIdea(id).subscribe({
          error: (err) => {
            this.ideas.splice(ideaIndex, 0, this.deletedIdea);
            this.notifyService.openSnackBar(err.error, "Close", "snackBarError");
          },
          next: (result) => {
            this.notifyService.openSnackBar(""+result, "Close", "snackBarSuccess");
            
          }
        });
      }, 3000);

      snackBarRef.onAction().subscribe(() => {
        clearTimeout(this.deleteTimeout);
        this.ideas.splice(ideaIndex, 0, this.deletedIdea);
      });
    }
    else  this.notifyService.openSnackBar("Error in deleting the idea", "Close", "snackBarError");

  }

  isNotFound(){ return this.error404; }

  

}
