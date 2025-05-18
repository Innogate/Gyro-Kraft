import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { UserMasterComponent } from './user-master/user-master.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { CutterNameComponent } from './master/cutter-name/cutter-name.component';

export default [
    { path: 'cutter-name', component: CutterNameComponent },
    { path: 'empty', component: Empty },
    { path: 'user-master', component: UserMasterComponent },
    { path: 'create-user', component:CreateUsersComponent },
    { path: '**', redirectTo: '/notfound' },

] as Routes;
