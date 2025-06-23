import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../shared/services/event.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { HeaderComponent } from "../../../shared/component/header/header.component";
import { TicketTypeService } from '../../../shared/services/ticket-type.service';
import { TicketTyeResponse } from '../../../shared/interface/ticket.interface';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Order } from '../../../shared/interface/order.interface';
import { OrderService } from '../../../shared/services/order.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-event-by-id',
  imports: [HeaderComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './event-by-id.component.html',
  styles: ``
})
export class EventByIdComponent implements OnInit {

  public eventData : any
  public ticketTypeResponse : TicketTyeResponse[] = []
  public myForm : FormGroup

  constructor(
    private eventService : EventService,
    private activatedRoute : ActivatedRoute,
    private ticketType : TicketTypeService,
    private fb : FormBuilder,
    private auth :  AuthenticationService,
    private order : OrderService,
    private router : Router
  ) {
    this.myForm = this.fb.group({
      PaymentMethod: [''],
      Items: this.fb.array([
        this.fb.group({
          ticketType: [''],
          Quantity: [1]
        })
      ])
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({id})=> this.eventService.getEventById(id))
      ).subscribe({
        next: (data) => {
          this.eventData = data["s:Envelope"]["s:Body"]["GetByIdResponse"]["GetByIdResult"]
        }
      })
    this.getAllTikectType()
    this.receiveData
  }



  getAllTikectType():void{
    this.ticketType.getAllTickets().subscribe({
      next: (data) => {
        console.log(data,123)
        this.ticketTypeResponse = data['s:Envelope']['s:Body']['GetAllResponse']['GetAllResult']['Items']['TicketTypeResponse']
      },error : (err) => {
        console.log("soy un error")
        console.log(err)
      }
    })
  }

 addItem() {
  console.log(1)
  this.items.push(this.fb.group({
    ticketType: [''],
    Quantity: [1]
  }));
}

  get items(): FormArray {
    return this.myForm.get('Items') as FormArray;
  }

  removeItem(index: number) {
  this.items.removeAt(index);
}

  get receiveData(){
    return this.auth.profileData
  }

  sendData():void{
    console.log(this.myForm.value)
    if (!this.receiveData) return;
      
    const newData : Order = {...this.myForm.value}
    newData.customerID = this.receiveData.Id;

    this.order.addOrder(newData).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
        Swal.fire({
          title : '¡Exito!',
          text  : 'Boleto comprado correctamente',
          icon: 'success',
          confirmButtonText : 'Aceptar' 
        })
      },error: () => {
        this.myForm.reset();

        Swal.fire({
          title : 'Error en la compra!',
          text  : 'Ocurrio un error en la compra',
          icon: 'error',
          confirmButtonText : 'Aceptar' 
        })
      }
    })
    
  }

}
