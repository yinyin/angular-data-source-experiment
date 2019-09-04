import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { ExpDataSource } from '../exp-data-source';

@Component({
  selector: 'app-try-data-table',
  templateUrl: './try-data-table.component.html',
  styleUrls: ['./try-data-table.component.scss']
})
export class TryDataTableComponent implements OnInit {
  dataSource = new ExpDataSource(100);

  displayedColumns: string[] = ["indexValue", "itemName"];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

}
