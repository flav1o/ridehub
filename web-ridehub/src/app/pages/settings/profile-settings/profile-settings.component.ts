import { Component, Input, OnInit } from '@angular/core';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { GetUsersService } from 'src/app/services/users/get-users.service';
import { User } from '../../../interfaces/users/user'

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {

  constructor(
    public userData: UserDataService,
    public user: GetUsersService,
    public componentToggler: ComponentTogglerService
  ) { }

  @Input() fieldToChange: string ="descricao";
  @Input() userInformation: User;

  ngOnInit(): void {
    this.getUserInformation();
    setTimeout(() => {
      this.componentToggler.loading = true;
    }, 0);
  }

  getUserInformation(): void {
    this.user.getUsers(this.userData.user.id_utilizador).subscribe(
      data => {
        console.log(data);
        this.componentToggler.loading = false;
        this.userInformation = data;
      },
      error => console.log(error)
    );
  }

  fieldValue(field: string): void{
    this.fieldToChange = field;
    this.componentToggler.settingsModal = true;
  }

  deactivateAccount(): void {
    this.componentToggler.deactivateModal = true;
  }

}
