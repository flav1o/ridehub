import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForgetPassword } from 'src/app/interfaces/auth/forget-password';
import { AlertModal } from 'src/app/interfaces/components/alert-modal';
import { verifyEmail } from 'src/app/namespaces/email-verifier';
import { verifyPassword } from 'src/app/namespaces/password-verifier';
import { ForgetPasswordService } from 'src/app/services/auth/forget-password.service';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';


@Component({
  selector: 'app-forget-password-modal',
  templateUrl: './forget-password-modal.component.html',
  styleUrls: ['./forget-password-modal.component.scss']
})
export class ForgetPasswordModalComponent implements OnInit {

  constructor(
    public componentToggler: ComponentTogglerService,
    private _forgetPassword: ForgetPasswordService,
    private _router: Router
    
  ) { }

  alertStatus: AlertModal;

  ngOnInit(): void {
  }
  

  resetPassword(changeData): void {

    console.log(changeData.form.value);
    if(!verifyEmail.emailValidator.isValid(changeData.form.value.email)) return;

    if(!verifyPassword.passwordValidator.isValid(changeData.form.value.password)) return;

    if(changeData.form.value.password != changeData.form.value.confirmpassword) return;

    const data: ForgetPassword = {
      email: changeData.form.value.email,
      n_telemovel : changeData.form.value.n_telemovel,
      password : changeData.form.value.password,
      confirmpassword: changeData.form.value.confirmpassword
    }

    this._forgetPassword.forgetPassword(data).subscribe(
      data => {
        console.log(data)
        this._router.navigate(['/login']);
      },
      error => console.log(error)
    )
  }

}
