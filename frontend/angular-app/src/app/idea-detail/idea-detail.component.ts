import { Component } from '@angular/core';
import { RestBackendService } from '../_service/rest-backend/rest-backend.service';
import { CommentRequest } from '../_service/rest-backend/typeModel/comment-request.type';
import { inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommentComponent } from './comment/comment.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { CommonModule } from '@angular/common';
import { NotifyService } from '../_service/notify/notify.service';



@Component({
  selector: 'app-idea-detail',
  standalone: true,
  imports: [RouterLink, CommentComponent, ReactiveFormsModule, NotFoundComponent, CommonModule],
  templateUrl: './idea-detail.component.html',
  styleUrl: './idea-detail.component.scss'
})
export class IdeaDetailComponent {
  title: string = '';
  description: any = ''; 
  authorIdea: string = '';
  id: number ;
  date: Date = new Date();
  likes: number=0 ;
  dislikes: number=0 ;
  error404: boolean = false;
  dateAsString: string;
  limitCommentToShow: number = 3;
  pageComment: number = 1;
  numberOfComments: number = 0;
  
  commentArray: CommentRequest[] = [];
  commentForm= new FormGroup({
    comment: new FormControl('')
  });
  
  restBackend = inject(RestBackendService);
  route = inject(ActivatedRoute);
  notifyService=inject(NotifyService);


  ngOnInit(){
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.getIdeaById();
  }
    
  


  getCommentsIdea(): void {
    this.restBackend.getComments(this.pageComment, this.limitCommentToShow, this.id).subscribe((data: CommentRequest[]) => {
      const newComments = data.filter(comment => !this.commentArray.some(existingComment => existingComment.id === comment.id));

      this.commentArray = [...this.commentArray, ...newComments]; 
    });
  }


  loadMoreComments() {
    this.pageComment++; 
    this.getCommentsIdea(); 
  }


  getIdeaById() {
    this.restBackend.getIdeaById(this.id).subscribe({
      next: (data) => {
        this.title = data.title;
        this.description = data.description;
        this.authorIdea = data.User?.username!;
        this.likes = data.like || 0;
        this.dislikes = data.dislike || 0;
        this.date = new Date(data.createdAt!);
        this.dateAsString = this.getFormattedDate();


        this.getNumberOfComments(); 
        this.getCommentsIdea();
      },
      error: (err) => {
        if (err.status === 404) {
          this.error404 = true;
        } else {
          this.notifyService.openSnackBar(err.error, "Close", "snackbarErrorServer");
        }
      }
    });
  }


  getNumberOfComments() {
    this.restBackend.getNumberOfComments(this.id).subscribe({
      next: (data) => {
        this.numberOfComments = data.count;
      },
      error: (err) => {
        this.notifyService.openSnackBar(err.error, "Close", "snackbarErrorServer");
      }
    });
  }


  onSubmitComment() {
    if (this.commentForm.value.comment === '' || !localStorage.getItem("user") ) {
      this.notifyService.openSnackBar("Please fill in all fields", "Close", "snackBarWarning");
    } else {
      let commentRequest: CommentRequest = this.generateComment();
      this.restBackend.addComment(commentRequest).subscribe({
        next:(result) => {
          commentRequest.id = result.id;
          this.notifyService.openSnackBar("Comment added successfully", "Close", "snackBarSuccess");
          this.commentArray.push(commentRequest);
        },
        error: (err) => {
          this.notifyService.openSnackBar(err.error, "Close", "snackBarError");
        },
        complete: () => {
          this.commentForm.reset();
        }}
      );    
   }
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

  getFormattedDate(): string {
    const day = this.date.getDate().toString().padStart(2, '0');
    const month = (this.date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = this.date.getFullYear();
    const hours = this.date.getHours().toString().padStart(2, '0');
    const minutes = this.date.getMinutes().toString().padStart(2, '0');
    const seconds = this.date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  generateComment(): CommentRequest {
    let usernameI=localStorage.getItem("user");
    return {
        IdeaId: this.id,
        description: this.commentForm.value.comment as string,
        User: {username:usernameI!},
        createdAt: new Date(), 
        like: 0,
        username: usernameI!
    };
  }
  
  onLike() {
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


  onDislike() {
    this.restBackend.dislikeIdea(this.id).subscribe({
      next: (data) => {
        this.likes = data.like || 0;
        this.dislikes = data.dislike || 0;
        this.notifyService.openSnackBar("Thanks for your feedback.", "Close", "snackBarSuccess");
      },
      error: (err) => {
        this.notifyService.openSnackBar("An error occurred while disliking the idea.", "Close", "snackBarError");
      }
    });
  }


  isNotFound(){ return this.error404; }

}
