import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { UserMasterComponent } from './user-master/user-master.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { OrdersheetComponent } from './ordersheet/ordersheet.component';

export default [
    { path: 'empty', component: Empty },
    { path: 'user-master', component: UserMasterComponent },
    { path: 'create-user', component:CreateUsersComponent },
    { path: 'order-sheet', component:OrdersheetComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
