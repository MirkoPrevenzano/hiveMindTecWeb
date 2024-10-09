import { Component, Input, OnInit, inject } from '@angular/core';
import { CommentRequest } from '../../_service/rest-backend/typeModel/comment-request.type';
import { RestBackendService } from '../../_service/rest-backend/rest-backend.service';
import { RouterLink } from '@angular/router';
import{NotifyService} from '../../_service/notify/notify.service'

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input({ required: true })comment: CommentRequest; //set "strictPropertyInitialization": false in tsconfig
  restBackend = inject(RestBackendService);
  notifyService = inject(NotifyService);

  testContainer: string = '';
  idIdea: number ;
  author: string = '';
  idComment: number;
  likes: number;
  dislikes: number;
  date: Date = new Date();
  dateAsString: string;
  
  
  onLike() {  
    this.restBackend.likeComment(this.idComment, this.idIdea).subscribe({
      next: (data) => {
        this.likes = data.like!;
        this.notifyService.openSnackBar("Like added", "Close", "snackBarSuccess");
        
      },
      error: (err) => {
        this.notifyService.openSnackBar(err.error, "Close", "snackBarError");}
    });
  
  }
  
  ngOnInit(){
    this.testContainer= this.comment.description;
    this.idIdea = this.comment.IdeaId;
    this.author = this.comment.User!.username;
    this.idComment = this.comment.id!;
    this.likes = this.comment.like!;
    this.date = new Date(this.comment.createdAt!);
    this.dateAsString = this.getFormattedDate();

  }

 
  getFormattedDate(): string {
    const day = this.date.getDate().toString().padStart(2, '0');
    const month = (this.date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = this.date.getFullYear();
    const hours = this.date.getHours().toString().padStart(2, '0');
    const minutes = this.date.getMinutes().toString().padStart(2, '0');
    const seconds = this.date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

}
