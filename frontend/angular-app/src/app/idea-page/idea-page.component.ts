import { Component, HostListener, SecurityContext } from '@angular/core';
import { IdeaComponent } from './idea/idea.component';
import { RestBackendService } from '../_service/rest-backend/rest-backend.service';
import { IdeaRequest } from '../_service/rest-backend/typeModel/idea-request.type';
import { IdeaFormComponent } from '../idea-form/idea-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-idea-page',
  standalone: true,
  imports: [IdeaComponent,IdeaFormComponent,FormsModule],
  templateUrl: './idea-page.component.html',
  styleUrl: './idea-page.component.scss'
})


export class IdeaPageComponent {
  constructor(private restService: RestBackendService, ) {}


  ideas: IdeaRequest[] = [];
  limit: number = 10;
  currentPage: number = 1;
  selectedOption: string = 'controversial';
  private isPageLoaded: boolean = false
 
 
  ngOnInit(){
    this.getIdeaMostControversial();
  }

  ngAfterViewInit() {
    this.isPageLoaded = true;
  }
  
 
  
  getIdeaMostControversial(): void {

    this.restService.getIdeaMostControversial(this.currentPage, this.limit).subscribe((data: IdeaRequest[]) => {
      const newIdeas = data.filter(idea => !this.ideas.some(existingIdea => existingIdea.id === idea.id));

      this.ideas = [...this.ideas, ...newIdeas]; 
    });
    
  }


  getIdeaMostPopular():void{
    this.restService.getIdeaMostPopular(this.currentPage, this.limit).subscribe((data: IdeaRequest[]) => {
      const newIdeas = data.filter(idea => !this.ideas.some(existingIdea => existingIdea.id === idea.id));

      this.ideas = [...this.ideas, ...newIdeas]; 
    });
  }


  getIdeaMostUnpopular():void{
    this.restService.getIdeaMostUnpopular(this.currentPage, this.limit).subscribe((data: IdeaRequest[]) => {
      const newIdeas = data.filter(idea => !this.ideas.some(existingIdea => existingIdea.id === idea.id));
      this.ideas = [...this.ideas, ...newIdeas]; 
    });
  }


  loadMoreIdeas() {
    this.currentPage++; 
    if(this.selectedOption === 'popular')   this.getIdeaMostPopular();
    else if(this.selectedOption === 'unpopular')    this.getIdeaMostUnpopular();
    else    this.getIdeaMostControversial(); 
    }

   
  @HostListener('window:scroll', ['$event'])
  
  onWindowScroll() {
      if(!this.isPageLoaded) return;

      const pos = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
      const max = document.documentElement.scrollHeight;

      if (pos === max) {
        this.loadMoreIdeas();
      }
  }


  onSelectionChange(): void {
    this.currentPage=1;
    this.ideas = [];
    if (this.selectedOption === 'popular')       this.getIdeaMostPopular();
    else if (this.selectedOption === 'unpopular')       this.getIdeaMostUnpopular();
    else  this.getIdeaMostControversial();
  }
  
 
}

