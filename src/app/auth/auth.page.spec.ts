import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { AuthPage } from './auth.page';
import { AuthService } from '../services/auth.service';

describe('AuthPage', () => {
  let component: AuthPage;
  let fixture: ComponentFixture<AuthPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        AuthPage
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ mode: 'login' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthPage);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.authForm).toBeDefined();
    expect(component.authForm.get('email')).toBeTruthy();
    expect(component.authForm.get('password')).toBeTruthy();
    expect(component.authForm.get('nombre')).toBeTruthy();
    expect(component.authForm.get('apellidos')).toBeTruthy();
    expect(component.authForm.get('telefono')).toBeTruthy();
  });

  it('should set isLogin to true when mode is login', () => {
    expect(component.isLogin).toBe(true);
  });

  it('should validate email correctly', () => {
    const emailControl = component.authForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.hasError('required')).toBeTruthy();

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate password correctly', () => {
    const passwordControl = component.authForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.hasError('required')).toBeTruthy();

    passwordControl?.setValue('short');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('onlylowercase123');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.hasError('passwordStrength')).toBeTruthy();

    passwordControl?.setValue('ValidPassword123');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should validate nombre and apellidos correctly', () => {
    component.isLogin = false;
    component.updateFormValidation();

    const nombreControl = component.authForm.get('nombre');
    const apellidosControl = component.authForm.get('apellidos');

    nombreControl?.setValue('');
    apellidosControl?.setValue('');
    expect(nombreControl?.valid).toBeFalsy();
    expect(apellidosControl?.valid).toBeFalsy();

    nombreControl?.setValue('John123');
    apellidosControl?.setValue('Doe123');
    expect(nombreControl?.valid).toBeFalsy();
    expect(apellidosControl?.valid).toBeFalsy();

    nombreControl?.setValue('John');
    apellidosControl?.setValue('Doe');
    expect(nombreControl?.valid).toBeTruthy();
    expect(apellidosControl?.valid).toBeTruthy();
  });

  it('should validate telefono correctly', () => {
    component.isLogin = false;
    component.updateFormValidation();

    const telefonoControl = component.authForm.get('telefono');

    telefonoControl?.setValue('');
    expect(telefonoControl?.valid).toBeFalsy();

    telefonoControl?.setValue('123');
    expect(telefonoControl?.valid).toBeFalsy();

    telefonoControl?.setValue('1234567890');
    expect(telefonoControl?.valid).toBeTruthy();
  });

  it('should toggle between login and register modes', () => {
    expect(component.isLogin).toBe(true);
    component.toggleAuthMode();
    expect(component.isLogin).toBe(false);
    component.toggleAuthMode();
    expect(component.isLogin).toBe(true);
  });

  it('should call login method when form is submitted in login mode', fakeAsync(() => {
    component.isLogin = true;
    component.authForm.setValue({
      email: 'test@example.com',
      password: 'Password123',
      nombre: '',
      apellidos: '',
      telefono: ''
    });

    authServiceSpy.login.and.returnValue(Promise.resolve({ user: {} } as any));

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'Password123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  }));

  it('should call register method when form is submitted in register mode', fakeAsync(() => {
    component.isLogin = false;
    component.updateFormValidation();
    component.authForm.setValue({
      email: 'test@example.com',
      password: 'Password123',
      nombre: 'John',
      apellidos: 'Doe',
      telefono: '1234567890'
    });

    authServiceSpy.register.and.returnValue(Promise.resolve({ user: {} } as any));

    component.onSubmit();
    tick();

    expect(authServiceSpy.register).toHaveBeenCalledWith(
      'test@example.com',
      'Password123',
      'John',
      'Doe',
      '1234567890'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  }));

  /* it('should handle Firebase errors correctly', fakeAsync(() => {
    component.isLogin = true;
    component.authForm.setValue({
      email: 'test@example.com',
      password: 'Password123',
      nombre: 'Test',
      apellidos: 'Test',
      telefono: '1231231234'
    });

    const firebaseError = new Error('Firebase Error') as Error & { code?: string };
    firebaseError.code = 'auth/user-not-found';

    authServiceSpy.login.and.rejectWith(firebaseError);

    component.onSubmit();
    tick();

    expect(component.firebaseError).toBe('Correo electrónico o contraseña incorrectos.');
  })); */

  it('should return correct error messages', () => {
    const emailControl = component.authForm.get('email');
    emailControl?.setErrors({ required: true });
    expect(component.getErrorMessage('email')).toBe('El campo email es requerido.');

    emailControl?.setErrors({ email: true });
    expect(component.getErrorMessage('email')).toBe('Por favor, ingrese un correo electrónico válido.');

    const passwordControl = component.authForm.get('password');
    passwordControl?.setErrors({ minlength: { requiredLength: 8 } });
    expect(component.getErrorMessage('password')).toBe('El campo debe tener al menos 8 caracteres.');

    passwordControl?.setErrors({ passwordStrength: true });
    expect(component.getErrorMessage('password')).toBe('La contraseña debe contener al menos una letra mayúscula y un número.');

    const telefonoControl = component.authForm.get('telefono');
    telefonoControl?.setErrors({ pattern: true });
    expect(component.getErrorMessage('telefono')).toBe('Por favor, ingrese un número de teléfono válido (10 dígitos).');

    const nombreControl = component.authForm.get('nombre');
    nombreControl?.setErrors({ onlyLetters: true });
    expect(component.getErrorMessage('nombre')).toBe('Este campo solo puede contener letras.');
  });
});
