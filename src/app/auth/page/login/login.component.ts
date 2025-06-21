import { Component } from '@angular/core';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidateService } from '../../../shared/services/validate.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {

  public myForm : FormGroup

  constructor(
    private authService : AuthenticationService,
    private fb : FormBuilder,
    private validate : ValidateService,
    private router : Router
  ) {
    this.myForm = this.fb.group({
      email     : ['',[Validators.required,Validators.pattern(this.validate.emailPattern)]],
      password  : ['',[Validators.required,Validators.minLength(5)]]
    })
  }

  isValidField(field:string){
    return this.validate.isValidField(this.myForm, field);
  }

  getFieldError(field:string):string|null{
    return this.validate.getFieldError(this.myForm,field);
  }


  login():void{
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.authService.getData(this.myForm.value).subscribe({
      next: (data) => {
        Swal.fire({
          title : '¡Exito!',
          text  : 'Logeado correctamente',
          icon: 'success',
          confirmButtonText : 'Aceptar' 
        })
        this.router.navigateByUrl('')
      }, error : () => {
        Swal.fire({
          title : '¡Error!',
          text  : 'Ocurrio un error',
          icon: 'error',
          confirmButtonText : 'Aceptar' 
        })
        this.myForm.reset();
      }
    })
  }

}
