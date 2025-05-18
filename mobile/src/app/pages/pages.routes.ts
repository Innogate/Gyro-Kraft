import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { UserMasterComponent } from './user-master/user-master.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { CutterNameComponent } from './master/cutter-name/cutter-name.component';
import { OrdersheetComponent } from './ordersheet/ordersheet.component';
import { PrintingMasterComponent } from './printing-master/printing-master.component';

export default [
    { path: 'cutter-name', component: CutterNameComponent },
    { path: 'empty', component: Empty },
    { path: 'user-master', component: UserMasterComponent },
    { path: 'create-user', component:CreateUsersComponent },
    { path: 'printing-master', component:PrintingMasterComponent },
    { path: 'order-sheet', component:OrdersheetComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
