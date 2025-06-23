import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidateService } from '../../shared/services/validate.service';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../../shared/services/admin-auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styles: ``,
})
export class AdminLoginComponent {
  public myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validate: ValidateService,
    private router: Router,
    private adminAuthService: AdminAuthService
  ) {
    this.myForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.pattern(this.validate.emailPattern)],
      ],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  isValidField(field: string) {
    return this.validate.isValidField(this.myForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validate.getFieldError(this.myForm, field);
  }

  login(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.adminAuthService.login(this.myForm.value).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        let errorMessage = 'Credenciales incorrectas';
        if (error.message === 'No tienes permisos de administrador') {
          errorMessage =
            'No tienes permisos para acceder al panel administrativo';
        }

        Swal.fire({
          title: '¡Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        this.myForm.reset();
      },
    });
  }
}
