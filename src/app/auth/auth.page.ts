// src/app/auth/auth.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseError } from 'firebase/app';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-10px)'
      })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ])
  ]
})
export class AuthPage implements OnInit {
  authForm!: FormGroup;
  isLogin: boolean = true;
  firebaseError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'login') {
        this.isLogin = true;
        this.updateFormValidation();
      }
    });
  }

  initForm() {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      nombre: ['', [Validators.required, this.onlyLettersValidator]],
      apellidos: ['', [Validators.required, this.onlyLettersValidator]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });

    this.updateFormValidation();
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    if (!hasUpperCase || !hasNumber) {
      return { passwordStrength: true };
    }

    return null;
  }

  onlyLettersValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const onlyLetters = /^[a-zA-Z\s]*$/.test(value);

    if (!onlyLetters) {
      return { onlyLetters: true };
    }

    return null;
  }

  updateFormValidation() {
    if (this.isLogin) {
      this.authForm.get('nombre')?.clearValidators();
      this.authForm.get('apellidos')?.clearValidators();
      this.authForm.get('telefono')?.clearValidators();
      this.authForm.get('nombre')?.setValue('');
      this.authForm.get('apellidos')?.setValue('');
      this.authForm.get('telefono')?.setValue('');
    } else {
      this.authForm.get('nombre')?.setValidators([Validators.required, this.onlyLettersValidator]);
      this.authForm.get('apellidos')?.setValidators([Validators.required, this.onlyLettersValidator]);
      this.authForm.get('telefono')?.setValidators([Validators.required, Validators.pattern('^[0-9]{10}$')]);
    }

    this.authForm.get('nombre')?.updateValueAndValidity();
    this.authForm.get('apellidos')?.updateValueAndValidity();
    this.authForm.get('telefono')?.updateValueAndValidity();
    this.authForm.get('email')?.setValue('');
    this.authForm.get('password')?.setValue('');
  }

  async onSubmit() {
    this.firebaseError = '';
    if (this.authForm.valid) {
      try {
        if (this.isLogin) {
          await this.authService.login(
            this.authForm.get('email')?.value,
            this.authForm.get('password')?.value
          );
        } else {
          await this.authService.register(
            this.authForm.get('email')?.value,
            this.authForm.get('password')?.value,
            this.authForm.get('nombre')?.value,
            this.authForm.get('apellidos')?.value,
            this.authForm.get('telefono')?.value
          );
        }
        console.log('Auth successful, navigating to /tasks');
        this.router.navigate(['/tasks']);
      } catch (error: any) {
        console.error('Error de autenticación:', error);
        if (error instanceof FirebaseError) {
          this.handleFirebaseError(error);
        }
      }
    } else {
      console.log('Formulario inválido');
    }
  }

  handleFirebaseError(error: FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.firebaseError = 'Este correo electrónico ya está en uso.';
        break;
      case 'auth/invalid-email':
        this.firebaseError = 'El correo electrónico no es válido.';
        break;
      case 'auth/weak-password':
        this.firebaseError = 'La contraseña es demasiado débil.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        this.firebaseError = 'Correo electrónico o contraseña incorrectos.';
        break;
      default:
        this.firebaseError = 'Ha ocurrido un error durante la autenticación.';
    }
  }

  toggleAuthMode() {
    this.isLogin = !this.isLogin;
    this.updateFormValidation();
    this.firebaseError = '';
  }

  getErrorMessage(controlName: string): string {
    const control = this.authForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return `El campo ${controlName} es requerido.`;
      }
      if (control.errors['email']) {
        return 'Por favor, ingrese un correo electrónico válido.';
      }
      if (control.errors['minlength']) {
        return `El campo debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
      }
      if (control.errors['passwordStrength']) {
        return 'La contraseña debe contener al menos una letra mayúscula y un número.';
      }
      if (control.errors['pattern']) {
        return 'Por favor, ingrese un número de teléfono válido (10 dígitos).';
      }
      if (control.errors['onlyLetters']) {
        return 'Este campo solo puede contener letras.';
      }
    }
    return '';
  }
}
