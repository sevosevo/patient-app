import {Component, Input} from '@angular/core';

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

}
