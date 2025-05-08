import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { CutterNameComponent } from './master/cutter-name/cutter-name.component';

export default [
    { path: 'cutter-name', component: CutterNameComponent },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' },

] as Routes;
