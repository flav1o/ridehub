import { Component, Input, OnInit } from '@angular/core';
import { ComponentData } from 'src/app/interfaces/component-data';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  
  @Input() receivedData: ComponentData;

  constructor(private componentToggler: ComponentTogglerService) { }

  ngOnInit(): void {
  }
  
  closeModal(): void {
    this.componentToggler.request = false;
  }
}
