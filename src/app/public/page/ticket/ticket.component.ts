import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../shared/component/header/header.component";
import { OrderResponse } from '../../../shared/interface/order.interface';
import { OrderService } from '../../../shared/services/order.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-ticket',
  imports: [HeaderComponent,NgClass],
  templateUrl: './ticket.component.html',
  styles: ``
})
export class TicketComponent implements OnInit {

  public orderData : OrderResponse[] = []

  constructor(
    private order : OrderService,
    private auth :  AuthenticationService
  ) {
    
  }

  ngOnInit(): void {
    this.receiveData
    this.getData();
  }

  get receiveData(){
    return this.auth.profileData
  }

  getData():void{
    if(!this.receiveData)return;

    this.order.getCustomerById(this.receiveData.Id).subscribe({
      next: (data) => {
        this.orderData = data['s:Envelope']['s:Body']['GetByCustomerIdResponse']['GetByCustomerIdResult']['OrderResponse']
      },error : (err) => {

      }
    })
  }

}
