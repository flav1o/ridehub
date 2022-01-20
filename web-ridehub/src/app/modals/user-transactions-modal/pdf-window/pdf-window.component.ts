import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2pdf from 'html2canvas';
import { Transaction } from 'src/app/interfaces/transactions/transaction';
import { GetTransactionsService } from 'src/app/services/transactions/get-transactions.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { GetUsersService } from 'src/app/services/users/get-users.service';
import { User } from 'src/app/interfaces/users/user';
import { Router } from '@angular/router';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';

@Component({
  selector: 'app-pdf-window',
  templateUrl: './pdf-window.component.html',
  styleUrls: ['./pdf-window.component.scss']
})
export class PdfWindowComponent implements OnInit {

  constructor(
    private _getUserTransactions: GetTransactionsService,
    private _userData: UserDataService,
    private _getUser: GetUsersService,
    private _componentToggler: ComponentTogglerService
  ) { }

  userTransactions: Transaction[] = [];
  userInfo: User;
  currentDate = Date.now();

  ngOnInit(): void {
    let DATA = document.getElementById('htmlData');

    this._getUserTransactions.getUserTransactions(this._userData.user.id_utilizador).subscribe(
      data => {
        data.forEach((item) => {
          if(item.tipo === 'I') item.tipo = 'IN';
          if(item.tipo === 'O') item.tipo = 'OUT'; 
        });
        
        this.userTransactions.push(...data);
      },
      error => console.log(error)
    )

    this._getUser.getUsers(this._userData.user.id_utilizador).subscribe(
      data => {
        console.log(data)
        this.userInfo = data
      },
      error => console.log(error)
      )
    }
    
    ngAfterViewInit(): void{
      setTimeout(() => {
      this.openPDF()
    }, 1000);
  }

  public openPDF(): void {
    let DATA = document.getElementById('htmlData');

    html2pdf(DATA).then(canvas => {
      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;

      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

      PDF.save(`${this.getDate()}_${this.userInfo.nome}.pdf`);
      this._componentToggler.pdfGenerator = false;
    });
  }

  getDate(){
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } 
}



