import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'patient-app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() title: string;

  @Input() showSaveButton = true;
  @Input() saveButtonDisabled = false;
  @Input() saveButtonLabel = 'Save';
  @Output() saveButtonClicked = new EventEmitter<void>();

  @Input() showBackButton = false;
  @Input() backButtonLabel = 'Back';
  @Output() backButtonClicked = new EventEmitter<void>();

}
