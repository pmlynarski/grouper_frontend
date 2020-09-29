import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '../../consts';
import { UsersListComponent } from './components';

const routes: Routes = [{ path: ROUTES.usersList.name, component: UsersListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
