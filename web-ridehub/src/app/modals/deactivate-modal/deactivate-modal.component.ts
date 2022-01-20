import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertModal } from 'src/app/interfaces/components/alert-modal';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { GetUsersService } from 'src/app/services/users/get-users.service';

@Component({
  selector: 'app-deactivate-modal',
  templateUrl: './deactivate-modal.component.html',
  styleUrls: ['./deactivate-modal.component.scss']
})
export class DeactivateModalComponent implements OnInit {
  alertStatus: AlertModal;
  
  constructor(
    public componentToggler: ComponentTogglerService,
    public userService: GetUsersService,
    private _userData: UserDataService,
    private _router: Router
    ) { }

  ngOnInit(): void {
  }

  @ViewChild('divToAnim') div: ElementRef;
  closeModal(): void {
    this.div.nativeElement.classList.remove('slide-in-top');
    this.div.nativeElement.classList.add('slide-out-bottom');

    setTimeout(() => {
      this.componentToggler.deactivateModal = false;
    }, 600);
  }

  deleteAction(): void {
    this.userService.deactivateUser(this._userData.user.id_utilizador).subscribe(
      data => {
        this.alertStatus = { success: true, message: 'Thank for coming with us in this journey! <3' };
        this.componentToggler.alertModal = true;
        localStorage.clear();

        setTimeout(() => {
          this._router.navigate(['/login']);
        }, 4500);
      },
      error => {
        this.alertStatus = { success: false, message: 'You have unfinished trips! You must finish them before deactivating this account!!' };
        this.componentToggler.alertModal = true;
      }
    )
  }
}
