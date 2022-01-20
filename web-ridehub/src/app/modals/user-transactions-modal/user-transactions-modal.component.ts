import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/interfaces/transactions/transaction';
import { GetTransactionsService } from 'src/app/services/transactions/get-transactions.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';

@Component({
  selector: 'app-user-transactions-modal',
  templateUrl: './user-transactions-modal.component.html',
  styleUrls: ['./user-transactions-modal.component.scss']
})
export class UserTransactionsModalComponent implements OnInit {

  constructor(
    private _getUserTransactions: GetTransactionsService,
    private _userData: UserDataService,
    public componentToggler: ComponentTogglerService
  ) { }

  userTransactions: Transaction[] = [];

  ngOnInit(): void {
    this._getUserTransactions.getUserTransactions(this._userData.user.id_utilizador).subscribe(
      data => {
        console.log(data)
        this.userTransactions.push(...data);
      },
      error => console.log(error)
    )
  }

  hideTransactions(div): void{
    div.classList.remove('slide-in-bottom');
    div.classList.add('slide-out-bottom');
    setTimeout(() => {
      this.componentToggler.transactionsModal = false;
    }, 2000);
  }

  savePDF(): void{
    this.componentToggler.pdfGenerator = true;
  }
}


