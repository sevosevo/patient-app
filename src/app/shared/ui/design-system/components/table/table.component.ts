import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';

export enum TableColumnType {
  TEXT = 'text',
  DATE = 'date',
  LINK = 'link',
}

export interface TableColumn {
  visible: boolean;
  field: string;
  label: string;
  type: TableColumnType;
}

export interface LinkTableColumn extends TableColumn {
  type: TableColumnType.LINK;
  href: (row: unknown) => string;
}

@Component({
  selector: 'patient-app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  readonly TableColumnType = TableColumnType;

  // tslint:disable-next-line:variable-name
  @Input('dataSource') _dataSource: any[];

  @Input() visibleColumns: TableColumn[];

  @Input() pageSize = 4;

  @Output() tableRowClicked = new EventEmitter<any>();

  dataSource: MatTableDataSource<any>;

  get columnFields(): Iterable<string> {
    return this.visibleColumns.filter(column => column.visible).map(column => column.field);
  }

  isLinkColumn(column: TableColumn): column is LinkTableColumn {
    return column.type === TableColumnType.LINK;
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>(this._dataSource);
    this.dataSource.paginator = this.paginator;
  }

}
