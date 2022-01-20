import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentTogglerService {

  constructor() { }

  rideModal: boolean = false;
  alertModal: boolean = false;
  loading: boolean = false;
  rideChat: boolean = false;
  rideMap: boolean = false;
  addVehicle: boolean = false;
  addBalance: boolean = false;
  settingsModal: boolean = false;
  deactivateModal: boolean = false;
  reportModal: boolean = false;
  evaluationModal: boolean = false;
  transactionsModal: boolean = false;
  pdfGenerator: boolean = false;
}
