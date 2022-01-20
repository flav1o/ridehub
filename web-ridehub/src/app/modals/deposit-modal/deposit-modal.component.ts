import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/interfaces/users/user';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { GetUsersService } from 'src/app/services/users/get-users.service';

@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html',
  styleUrls: ['./deposit-modal.component.scss']
})
export class DepositModalComponent implements OnInit {

  constructor(
    private userData: UserDataService,
    private _getUser: GetUsersService,
    private _componentToggler: ComponentTogglerService
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  user: User;
  
  getUser(): void{
    this._getUser.getUsers(this.userData.user.id_utilizador).subscribe(
      data => {
        this.user = data;
        console.log(data)
      },
      error => console.log(error)
    )
  }

  balanceManagement(addBalance): void{

    let data = {
      quantia: +addBalance.value.montante,
      operacao: 'I'
    }

    this._getUser.updateUserMoney(this.userData.user.id_utilizador, data).subscribe(
      data =>{
        console.log(data);
        this.closeButton();
      }, 
      error => console.log(error)
    )
  }

  @ViewChild('deposit_wrapper') container: ElementRef;
  closeButton(): void {
    this.container.nativeElement.classList.remove('slide-in-bottom');
    this.container.nativeElement.classList.add('slide-out-bottom');
   
    setTimeout(() => {
      this._componentToggler.addBalance = false;
      window.location.href = "/settings"
    }, 1000);
  }

}
