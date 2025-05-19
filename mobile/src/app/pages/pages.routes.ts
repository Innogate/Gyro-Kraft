import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { UserMasterComponent } from './user-master/user-master.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { CutterNameComponent } from './master/cutter-name/cutter-name.component';
import { OrdersheetComponent } from './ordersheet/ordersheet.component';
import { AuthGuard } from './auth/auth.guard';

export default [
    { path: 'cutter-name', component: CutterNameComponent, canActivate: [AuthGuard] },
    { path: 'empty', component: Empty },
    { path: 'user-master', component: UserMasterComponent, canActivate: [AuthGuard]  },
    { path: 'create-user', component:CreateUsersComponent, canActivate: [AuthGuard]  },
    { path: 'order-sheet', component:OrdersheetComponent, canActivate: [AuthGuard]  },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
