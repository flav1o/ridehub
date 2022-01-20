import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Rides } from 'src/app/interfaces/rides/ride';
import { RidesService } from 'src/app/services/rides/get-rides.service';
import { GetRideUsersService } from 'src/app/services/rides/get-ride-users.service';
import { RideUsers } from 'src/app/interfaces/rides/ride-users';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { AlertModal } from 'src/app/interfaces/components/alert-modal';
import { JoinRideService } from 'src/app/services/rides/join-ride.service';
import { JoinRide } from 'src/app/interfaces/rides/join-ride';
import { UserDataService } from 'src/app/services/user-data.service';
import { DeleteRideService } from 'src/app/services/rides/delete-ride.service';
import { ChatService } from 'src/app/services/chats/chat.service';
import { GetUsersService } from 'src/app/services/users/get-users.service';
import { EvaluationsRideInfo } from 'src/app/interfaces/evaluations/evaluations-ride-info';
import { CreateEvaluationsService } from 'src/app/services/evaluations/create-evaluations.service';

@Component({
  selector: 'app-ride-lobby',
  templateUrl: './ride-lobby.component.html',
  styleUrls: ['./ride-lobby.component.scss']
})
export class RideLobbyComponent implements OnInit {

  @Input() evaluationInformation: EvaluationsRideInfo;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _rides: RidesService,
    private _ridesUsers: GetRideUsersService,
    private _joinRide: JoinRideService,
    private _userData: UserDataService,
    private _deleteRide: DeleteRideService,
    public componentToggler: ComponentTogglerService,
    private _chat: ChatService,
    private _getUsers: GetUsersService,
    private _getEvaluations: CreateEvaluationsService
  ) { }

  @ViewChild('buttonJoin') buttonJoin: ElementRef
  currentRide: Rides;
  currentUsers: RideUsers[];
  alertStatus: AlertModal;
  rideID: number;
  chatID: string;
  isOnRide: boolean = false;
  isOwner: boolean = false;
  evaluated : boolean = false;

  ngOnInit(): void {
    this.rideID = +this._activatedRoute.snapshot.paramMap.get('id');
    this.getRide(this.rideID);
    this.getRideUsers(this.rideID);
    this.componentToggler.rideMap = false;

    this._getEvaluations.verifyRideEvaluation(this.rideID, this._userData.user.id_utilizador).subscribe(
      data => {
        if(data.count > 0){
          this.evaluated = true;
        }
      },
      error => console.log(error)
    );
  }

  getRide(rideID): void {
    this._rides.getOneRide(rideID).subscribe(
      data => {
        this.currentRide = data
        console.log("Current Ride ->", this.currentRide);

        this.chatID = data.id_chat;
        if(!this.currentRide){
          this._router.navigate(["/current-listed"]);
        }
      },
      error => console.error(error)
    );
  }

  getRideUsers(rideID: number): void {
    this._ridesUsers.getRideUsers(rideID).subscribe(
      data => {
        this.currentUsers = data;
        console.log("Current users ->", this.currentUsers);
        this.checkButton();

        if(this._userData.user.id_utilizador === this.currentRide.id_utilizador)
          this.isOwner = true;

      },
      error => console.log(error),
    )
  }

  checkButton(): void {
    this.currentUsers.forEach((x) => {
      if (x.id_utilizador === this._userData.user.id_utilizador) this.isOnRide = true;
    })
  }

  verifyUserMoney(): void {
    this._getUsers.getUserMoney(this._userData.user.id_utilizador).subscribe(
      data => this.askJoinRide(data['saldo']),
      error => console.log(error)
    );
  }

  updateMoney(type: string): void {
    let data = { quantia: this.currentRide.custo, operacao: type };

    this._getUsers.updateUserMoney(this._userData.user.id_utilizador, data).subscribe(
      data => console.log(data),
      error => console.log(error)
    )
  }

  askJoinRide(saldo: number): void {

    if(saldo < this.currentRide.custo){
      this.alertStatus = { success: false, message: 'Not enough money!' };
      this.componentToggler.alertModal = true;
      return;
    }

    this.getRideUsers(this.rideID);

    let userInfo: JoinRide = {
      id_viagem: this.rideID,
      id_utilizador: this._userData.user.id_utilizador
    }

    if (this.currentRide.lugares_disponiveis > this.currentUsers.length) {
      this.updateMoney('O');

      this._joinRide.joinRideUser(userInfo).subscribe(
        data => {
          console.log(data)
          this.checkButton();
        },
        error => console.log(error)
      )
      this.alertStatus = { success: true, message: 'Joining Ride!' }

      setTimeout(() => {
        this._router.navigate([`/ride-lobby/${this.rideID}`])
        .then(() => {
          window.location.reload();
        });
      }, 4000);

    } else {
      this.alertStatus = { success: false, message: 'Ride is Full!' }
    }

    this.componentToggler.alertModal = true;
  }

  cancelRide(): void {
    if(this._userData.user.id_utilizador !== this.currentUsers[0].id_utilizador) return;

    this._deleteRide.cancelRide(this.rideID, {estado: 'C'}).subscribe(
      data => console.log(data),
      error => console.log(error)
    )

    setTimeout(() => {
      this._router.navigate(['/home']);
    }, 2000);
  }

  leaveRide(): void {
    this.componentToggler.alertModal = true;
    this.alertStatus = { success: true, message: 'Leaving the ride!' }
    this.updateMoney('I');
    this._deleteRide.leaveRide(this.rideID, this._userData.user.id_utilizador).subscribe(
      data => {
        setTimeout(() => {
          this._router.navigate(['/home']);
        }, 3000)
      },
      error => console.log(error)
    )
  }

  @Input() rideDetails;
  rideChat(): void {
    this._chat.getChatID(this.rideID).subscribe(
      data =>{
        this.rideDetails = { id_chat: data.id_chat,id_ride: this.rideID }
        this.componentToggler.rideChat = true;
        console.log(this.rideDetails);
      },
      error => console.log(error)
    );
  }

  rideMap(): void {
    this.rideDetails = { id_ride: this.rideID, id_owner: this.currentUsers[0].id_utilizador, state: this.currentRide.estado };
    this.componentToggler.rideMap = true;
  }

  evaluateRide(): void{
    this.evaluationInformation = {
      id_viagem: this.rideID,
      id_avaliador: this._userData.user.id_utilizador
    }
    this.componentToggler.evaluationModal = true;
  }

  openProfile(userID: number): void {
    this._router.navigate([`/profile/${userID}`]);
  }

}


