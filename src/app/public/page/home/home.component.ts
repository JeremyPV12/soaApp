import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../shared/services/event.service';
import { HeaderComponent } from "../../../shared/component/header/header.component";

@Component({
  selector: 'app-home',
  imports: [RouterLink, HeaderComponent],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {

  public EventData : [] = []

  constructor(
    private eventService : EventService
  ) {
    
  }

  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.EventData = data["s:Envelope"]["s:Body"]["GetAllResponse"]["GetAllResult"]["Items"]["EventResponse"]
        console.log(data);
      },error : (err) => {
        console.log(err)
      }
    })
  }

}
