import {Component, Input} from '@angular/core';

export enum TableColumnType {
  TEXT = 'text',
  DATE = 'date', // @todo: add support for this type
}

export interface TableColumn {
  field: string;
  label: string;
  type: TableColumnType;
}

@Component({
  selector: 'patient-app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {

  readonly TableColumnType = TableColumnType;

  @Input() dataSource: any[];

  @Input() visibleColumns: TableColumn[];

  get columnFields(): Iterable<string> {
    return this.visibleColumns.map(column => column.field);
  }

}
