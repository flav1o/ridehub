import { Component, Input, OnInit } from '@angular/core';
import { AlertModal } from 'src/app/interfaces/components/alert-modal';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent implements OnInit {
  @Input() status : AlertModal;

  constructor(private componentToggler: ComponentTogglerService ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.componentToggler.alertModal = false;
    }, 3000);
  }
}
