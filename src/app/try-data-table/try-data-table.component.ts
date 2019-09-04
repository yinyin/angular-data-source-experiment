import { Component, OnInit } from '@angular/core';

import { ExpDataSource } from '../exp-data-source';

@Component({
  selector: 'app-try-data-table',
  templateUrl: './try-data-table.component.html',
  styleUrls: ['./try-data-table.component.scss']
})
export class TryDataTableComponent implements OnInit {
  dataSource = new ExpDataSource(100);

  displayedColumns: string[] = ["indexValue", "itemName"];

  constructor() { }

  ngOnInit() {
  }

}
