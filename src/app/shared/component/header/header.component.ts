import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent implements OnInit {

  state : boolean = true 

  constructor(
    private auth :  AuthenticationService
  ) {
    
  }

  ngOnInit(): void {
    this.receiveData
    setTimeout(() => {
      if (this.receiveData) {
        this.state = false
      }
    }, 1000);
  }

  get receiveData(){
    return this.auth.profileData
  }

  logOut():void{
    this.state = true;
    this.auth.logOut();
    Swal.fire({
      title : '!Exito¡',
      text  : 'Sesion cerrada correctamente',
      icon: 'success',
      confirmButtonText : 'Aceptar' 
    })
  }

}
