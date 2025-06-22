import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../shared/services/event.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { HeaderComponent } from "../../../shared/component/header/header.component";

@Component({
  selector: 'app-event-by-id',
  imports: [HeaderComponent],
  templateUrl: './event-by-id.component.html',
  styles: ``
})
export class EventByIdComponent implements OnInit {

  public eventData : any

  constructor(
    private eventService : EventService,
    private activatedRoute : ActivatedRoute,
  ) {
    
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({id})=> this.eventService.getEventById(id))
      ).subscribe({
        next: (data) => {
          this.eventData = data["s:Envelope"]["s:Body"]["GetByIdResponse"]["GetByIdResult"]
          console.log(this.eventData)
        }
      })
  }

}
