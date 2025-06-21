import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public numberPattern : string = "^9[0-9]*$";

  public isValidField(form : FormGroup, field : string){
    return form.controls[field].touched && form.controls[field].errors;
  }

  public getFieldError(form : FormGroup, field : string):string| null{
    if (!form.controls[field]) return null;
    const errors = form.controls[field].errors || {}

    for (const key of Object.keys(errors)){
      switch(key){
        case 'required':
          return "Es un campo requerido"
        case 'minlength':
          return `Debe haber al menos ${errors['minlength'].requiredLength} caracteres`
        case 'maxlength':
          return `Debe haber maximo ${errors['maxlength'].requiredLength} caracteres`
        case 'emailTaken':
          return 'Este email ya tiene una cuenta asociada'
        case 'emailExist':
          return "Este email no tiene una cuenta asociada"
        case 'dniValidate':
          return "Ejemplo de DNI valido 87654321"
        case 'rucValidate':
        return "Ejemplo de RUC valido 12121212121"
        case 'notZero':
        return "Debe selecionar una opcion valida"
        case 'pattern':
          if (field == 'email') {
            return "Ejemplo de email valido example@gmail.com"
          }else if (field == 'cellPhoneNumber'){
            return "Ejemplo de telefono valido 987654321";
          }else if (field == 'documentNumber'){
            return "Ejemplo de DNI valido 87654321"
          }
      } 
    }
    return null
  }

  fieldOneEqualFieldTwo(field1 : string , field2: string){
    return (formGroup : AbstractControl) : ValidationErrors | null  => {
      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;
      if ( fieldValue1 !== fieldValue2) {
        formGroup.get(field2)?.setErrors({notEqual : true})
        return {notEqual : true}
      }  
      formGroup.get(field2)?.setErrors(null)
      return null;
    }
  }

}
