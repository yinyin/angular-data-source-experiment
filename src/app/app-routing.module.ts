import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TryDataTableComponent } from './try-data-table/try-data-table.component';

const routes: Routes = [
  { path: 'try-data-table', component: TryDataTableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
