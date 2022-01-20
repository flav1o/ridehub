import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ComponentData } from 'src/app/interfaces/component-data';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

  @Input() receivedData: ComponentData;

  constructor(private componentToggler: ComponentTogglerService) {}

  ngOnInit(): void {
    
  }

  closeModal(): void {
    this.componentToggler.description = false;
  }
}
