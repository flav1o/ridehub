import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertModal } from 'src/app/interfaces/components/alert-modal';
import { User } from 'src/app/interfaces/users/user';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { GetUsersService } from 'src/app/services/users/get-users.service';
import { verifyEmail } from 'src/app/namespaces/email-verifier';
import { verifyPassword } from 'src/app/namespaces/password-verifier';

@Component({
  selector: 'app-profile-settings-modal',
  templateUrl: './profile-settings-modal.component.html',
  styleUrls: ['./profile-settings-modal.component.scss']
})
export class ProfileSettingsModalComponent implements OnInit {
  @Input() userInformation: User;
  @Input() fieldToChange: string;
  alertStatus: AlertModal;

  constructor(
    public userData: UserDataService,
    public user: GetUsersService,
    public componentToggler: ComponentTogglerService,
    private _router: Router,
  ) { }

  ngOnInit(): void { }


  changeField(changeData): void {
    if (changeData.form.status === 'INVALID') return;

    if(this.fieldToChange === 'email' && !verifyEmail.emailValidator.isValid(changeData.form.value.field)) {
      this.alertStatus = { success: false, message: 'Please verify your email!' };
      this.componentToggler.alertModal = true;
      return;
    }

    if(this.fieldToChange === 'password' && !verifyPassword.passwordValidator.isValid(changeData.form.value.field)) {
      this.alertStatus = { success: false, message: 'Password must have minimum of 8 characters and atleast 1 letter and 1 number!' };
      this.componentToggler.alertModal = true;
      return;
    }


    this.userInformation[this.fieldToChange] = changeData.form.value.field;


    this.user.updateUser(this.userData.user.id_utilizador, this.userInformation).subscribe(
      data => {
        if (this.fieldToChange === 'password') {
          setTimeout(() => {
            localStorage.clear();
            this._router.navigate(['/login']);
            this.alertStatus = { success: true, message: 'Changed correctly! Redirecting to Login!' };
            return;
          }, 4500);
        }

        this.alertStatus = { success: true, message: 'Changed correctly!!' };
        this.componentToggler.alertModal = true;
        this.closeModal();
      },
      error => {
        this.alertStatus = { success: false, message: 'Error while trying to change data!!!' };
        this.componentToggler.alertModal = true;
      }
    )
  }

  @ViewChild('divToAnim') div: ElementRef;
  closeModal(): void {
    this.div.nativeElement.classList.remove('slide-in-top');
    this.div.nativeElement.classList.add('slide-out-bottom');

    setTimeout(() => {
      this.componentToggler.settingsModal = false;
    }, 600);
  }
}
