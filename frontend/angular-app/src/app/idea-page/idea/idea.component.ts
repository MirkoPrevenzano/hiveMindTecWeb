import { Component, Input, NgModule, SecurityContext, inject } from '@angular/core';
import { RestBackendService } from '../../_service/rest-backend/rest-backend.service';
import { IdeaRequest } from '../../_service/rest-backend/typeModel/idea-request.type';
import { DomSanitizer } from '@angular/platform-browser';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommentComponent } from '../../idea-detail/comment/comment.component';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifyService } from '../../_service/notify/notify.service';
@Component({
  selector: 'app-idea',
  standalone: true,
  imports: [ReactiveFormsModule, CommentComponent, RouterLink],
  templateUrl: './idea.component.html',
  styleUrl: './idea.component.scss'
})
export class IdeaComponent {
  title: string = '';
  description: any = ''; 
  authorIdea: string = '';
  id: number ;
  errorMessage: string = '';
  successMessage: string = '';
  date: Date = new Date();
  likes: number ;
  dislikes: number ;
  dateAsString: string;


  @Input({ required: true })idea: IdeaRequest; 
  restBackend = inject(RestBackendService);
  sanitizer = inject(DomSanitizer);
  dialog=inject(MatDialog);
  router=inject(Router);
  notifyService=inject(NotifyService);
  
  
  ngOnInit(){
    this.initializeIdeaDetails();
  }

  private getFormattedDate(): string {
    const day = this.date.getDate().toString().padStart(2, '0');
    const month = (this.date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = this.date.getFullYear();
    const hours = this.date.getHours().toString().padStart(2, '0');
    const minutes = this.date.getMinutes().toString().padStart(2, '0');
    const seconds = this.date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    } else {
      return num.toString();
    }
  }
  
  private isValid(): boolean {
    return this.authorIdea!==localStorage.getItem('user');
  }

  onLike() {
    if(this.isValid())
    {
      this.restBackend.likeIdea(this.id).subscribe({
        next: (data) => {
          this.likes = data.like || 0;
          this.dislikes = data.dislike || 0;
          this.notifyService.openSnackBar("Thanks for your feedback.", "Close", "snackBarSuccess");
          
        },
        error: () => {
          this.notifyService.openSnackBar("An error occurred while liking the idea.", "Close", "snackBarError");
        }
      });
    }
    else
      this.notifyService.openSnackBar("You can't like your own idea.", "Close", "snackBarWarning");

  }


  onDislike() {
    if(this.isValid()){
      this.restBackend.dislikeIdea(this.id).subscribe({
        next: (data) => {
          this.likes = data.like || 0;
          this.dislikes = data.dislike || 0;
          this.notifyService.openSnackBar("Thanks for your feedback.", "Close", "snackBarSuccess");
        },
        error: () => {
          this.notifyService.openSnackBar("An error occurred while disliking the idea.", "Close", "snackBarError");}
      });
    }
    else
      this.notifyService.openSnackBar("You can't dislike your own idea.", "Close", "snackBarWarning");
  }

  private initializeIdeaDetails() {
    this.title = this.idea.title;
    this.description = this.sanitizer.sanitize(SecurityContext.HTML, this.idea.description);
    this.authorIdea = this.idea.User?.username!;
    this.id = this.idea.id!;
    this.date = new Date(this.idea.createdAt!);
    this.likes = this.idea.like!;
    this.dislikes = this.idea.dislike!;
    this.dateAsString = this.getFormattedDate();
  }


}
