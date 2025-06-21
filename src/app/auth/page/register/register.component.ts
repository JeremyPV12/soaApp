import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { ValidateService } from '../../../shared/services/validate.service';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent {

  public myForm : FormGroup

  constructor(
    private authService : AuthenticationService,
    private fb : FormBuilder,
    private validate : ValidateService,
    private router : Router
  ) {
    this.myForm = this.fb.group({
      name     : ['',[Validators.required,Validators.minLength(3),Validators.maxLength(28)]],
      lastName  : ['',[Validators.required,Validators.minLength(3),Validators.maxLength(28)]],
      phone  : ['',[Validators.required,Validators.pattern(this.validate.numberPattern),Validators.minLength(9),Validators.maxLength(9)]],
      email  : ['',[Validators.required,Validators.pattern(this.validate.emailPattern)]],
      password  : ['',[Validators.required,Validators.minLength(5),Validators.maxLength(18)]],
      repassword  : [''],
    },{
      validators : [
        this.validate.fieldOneEqualFieldTwo('password','repassword')
      ]
    })
  }


  register():void{
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      console.log(this.myForm.value,1)
      return;
    }
    console.log(this.myForm.value)
    this.authService.register(this.myForm.value).subscribe({
      next: (data) => {
        Swal.fire({
          title : '¡Exito!',
          text  : 'Registrado correctamente',
          icon: 'success',
          confirmButtonText : 'Aceptar' 
        })
        this.router.navigateByUrl('/login')
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

   isValidField(field:string){
    return this.validate.isValidField(this.myForm, field);
  }

  getFieldError(field:string):string|null{
    return this.validate.getFieldError(this.myForm,field);
  }

}
