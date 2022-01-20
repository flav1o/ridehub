import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { GetUsersService } from 'src/app/services/users/get-users.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    public userData: UserDataService,
    private _getUser: GetUsersService,
    public componentToggler: ComponentTogglerService,
    private _router: Router,
    public route: ActivatedRoute
  ) { }

  user;

  ngOnInit(): void {
    this._getUser.getUsers(this.userData.user.id_utilizador).subscribe(
      data => {
        this.user = data;
        console.log(data)
      },
      error => console.log(error)
    )
  }

  openModal(modal: string): void {

    switch (modal) {
      case 'profile':
        this._router.navigate([`/settings/profile-settings`]);
        break;
      case 'vehicles':
        this.componentToggler.addVehicle = true;
        break;
      case 'balance':
        this.componentToggler.addBalance = true;
        break;
      case 'transactions':
        this.componentToggler.transactionsModal = true;
        break;
    }
  }
}
