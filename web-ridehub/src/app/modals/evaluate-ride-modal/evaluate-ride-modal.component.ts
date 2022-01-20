import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AlertModal } from 'src/app/interfaces/components/alert-modal';
import { Evaluations } from 'src/app/interfaces/evaluations/evaluations';
import { EvaluationsRideInfo } from 'src/app/interfaces/evaluations/evaluations-ride-info';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { CreateEvaluationsService } from 'src/app/services/evaluations/create-evaluations.service';

@Component({
  selector: 'app-evaluate-ride-modal',
  templateUrl: './evaluate-ride-modal.component.html',
  styleUrls: ['./evaluate-ride-modal.component.scss']
})
export class EvaluateRideModalComponent implements OnInit {

  @Input() evaluationInformation: EvaluationsRideInfo;
  @Input() alertStatus: AlertModal;

  constructor(
    public componentToggler: ComponentTogglerService,
    private _evaluations: CreateEvaluationsService
  ) { }


  ngOnInit(): void {
  }

  evaluation: Evaluations;

  @ViewChild('evaluate_wrapper') div: ElementRef;
  closeModal(): void {
    this.div.nativeElement.classList.remove('slide-in-top');
    this.div.nativeElement.classList.add('slide-out-bottom');

    setTimeout(() => {
      this.componentToggler.evaluationModal = false;
    }, 600);
  }

  createEvaluation(addEvaluation): void {
    if(addEvaluation.form.status === "INVALID") return;
    console.log(addEvaluation.form)

    this.evaluation = {
      nota: addEvaluation.form.value.nota,
      descricao: addEvaluation.form.value.descricao,
      id_viagem: this.evaluationInformation.id_viagem,
      id_avaliador: this.evaluationInformation.id_avaliador
    }

    this._evaluations.postEvaluation(this.evaluation).subscribe(
      data => {
        console.log(data);
        this.closeModal();
      },
      error => console.log(error)
    )
  }

}
