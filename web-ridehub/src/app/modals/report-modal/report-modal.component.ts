import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertModal } from 'src/app/interfaces/components/alert-modal';
import { Reports } from 'src/app/interfaces/reports/reports';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { CreateReportService } from 'src/app/services/reports/create-report.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss'],
})
export class ReportModalComponent implements OnInit {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _reportService: CreateReportService,
    private _userData: UserDataService,
    public componentToggler: ComponentTogglerService
  ) { }

  userIdProfile: number;
  ngOnInit(): void {
    this.userIdProfile = +this._activatedRoute.snapshot.paramMap.get('id');
  }

  report: Reports
  alertStatus: AlertModal;

  createReport(motivo, descricao): void{
    if(!motivo || !descricao) return;

    this.report = {
      motivo,
      descricao,
      id_autor: this._userData.user.id_utilizador,
      id_reportado: this.userIdProfile
    }

    this._reportService.postReport(this.report).subscribe(
      data => {
        console.log(data)
        this.closeButton();
      },
      error => console.log(error)
    )
  }

  @ViewChild('report_wrapper') container: ElementRef;
  closeButton(): void {
    this.container.nativeElement.classList.remove('slide-in-bottom');
    this.container.nativeElement.classList.add('slide-out-bottom');

    setTimeout(() => {
      this.componentToggler.reportModal = false;
    }, 4500);
  }

}


