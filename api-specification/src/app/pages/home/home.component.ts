import { Input } from '@angular/core';
import { Component, OnInit, VERSION } from '@angular/core';
import { ComponentData } from 'src/app/interfaces/component-data';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import data from './requests.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public compToggler: ComponentTogglerService) { }

  apiData: any = data;
  auths: any = data[0];
  users: any = data[1];
  evaluation: any = data[2];
  reports: any = data[3];
  rides: any = data[4];
  occupants: any = data[5];
  transactions: any = data[6];
  vehicles: any = data[7];
  chats: any = data[8];

  ngOnInit(): void {
    console.log(data);
  }

  @Input() sendData: ComponentData;

  openDescription(position: number, parentText: string ): void {
    const parent: number = this.getParent(parentText);
    this.sendData = this.apiData[parent].requests[position];

    this.compToggler.description = true;
  }

  openRequest(position: number, parentText:string): void {
    const parent: number = this.getParent(parentText);
    this.sendData = this.apiData[parent].requests[position];

    this.compToggler.request = true;
  }


  getParent(parent: string): number {
    let getParent: number = 0;

    switch (parent) {
      case 'auths':
        getParent = 0;
        break;
      case 'users':
        getParent = 1;
        break;
      case 'evaluation':
        getParent = 2;
        break;
      case 'reports':
        getParent = 3;
        break;
      case 'rides':
        getParent = 4;
        break;
      case 'occupants':
        getParent = 5;
        break;
      case 'transactions':
        getParent = 6;
        break;
      case 'vehicles':
        getParent = 7;
        break;
      case 'chats':
        getParent = 8;
          break;
      default:
        break;
    }

    return getParent;
  }
}
