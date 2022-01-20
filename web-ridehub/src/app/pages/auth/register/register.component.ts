import { Component, OnInit } from '@angular/core';
import { Register } from 'src/app/interfaces/auth/register';
import { RegisterService } from 'src/app/services/auth/register.service';
import { verifyEmail } from 'src/app/namespaces/email-verifier';
import { verifyPassword } from 'src/app/namespaces/password-verifier';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { AlertModal } from 'src/app/interfaces/components/alert-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  alertStatus: AlertModal;

  constructor(
    private _register: RegisterService,
    public componentToggler: ComponentTogglerService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  sendForm(registerForm) {
    console.log(verifyPassword.passwordValidator.isValid(registerForm.form.value.password));

    if (registerForm.form.status === 'INVALID'
      || !verifyPassword.passwordValidator.isValid(registerForm.form.value.password)
      || !verifyEmail.emailValidator.isValid(registerForm.form.value.email)
    ) return;

    let userForm : Register = {
      email: registerForm.form.value.email,
      n_telemovel: registerForm.form.value.n_telemovel,
      password: registerForm.form.value.password,
      nome: registerForm.form.value.nome,
      descricao: `Hi, I'm new in this app!`,
      genero: 'NS',
      saldo: "0",
      estado_conta: "A"
    };

    this.componentToggler.loading = true;
    this._register.authRegister(userForm).subscribe(
      data => this.registerOnSuccess(),
      error => this.registerOnError(error)
    )
  }
  
  registerOnSuccess(): void {
    this.componentToggler.loading = false;
    
    this.alertStatus = { success: true, message: 'Welcome! Redirecting to login...' };
    this.componentToggler.alertModal = true;
    
    setTimeout(() => this._router.navigate(['login']), 5100);
  }
  
  registerOnError(error): void {
    this.componentToggler.loading = false;
    
    if(error.status === 400)
      this.alertStatus = { success: false, message: 'Please verify your data!' };
    
    if(error.status === 0)
      this.alertStatus = { success: false, message: 'Our services are offline, try again later!' };
    
    if(error.status === 500)
      this.alertStatus = { success: false, message: 'We are under maintenance, try again later! ' };

    this.componentToggler.alertModal = true;
  } 
}
