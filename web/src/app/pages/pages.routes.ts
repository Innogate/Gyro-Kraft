import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { UserMasterComponent } from './user-master/user-master.component';
import { CutterNameComponent } from './master/cutter-name/cutter-name.component';
import { OrdersheetComponent } from './ordersheet/ordersheet.component';
import { AuthGuard } from './auth/auth.guard';
import { PrinterMasterComponent } from './master/printer-master/printer-master.component';
import { OrderProcessComponent } from '../components/order-process/order-process.component';
import { CuttingPageComponent } from './cutting-page/cutting-page.component';
import { PrintPageComponent } from './print-page/print-page.component';

export default [
    { path: 'cutter-name', component: CutterNameComponent, canActivate: [AuthGuard] },
    { path: 'empty', component: Empty },
    { path: 'user-master', component: UserMasterComponent, canActivate: [AuthGuard]  },
    { path: 'order-sheet', component:OrdersheetComponent, canActivate: [AuthGuard]  },
    { path: 'printer-master', component:PrinterMasterComponent, canActivate: [AuthGuard]  },
    { path: 'order-process', component: OrderProcessComponent, canActivate: [AuthGuard]  },
    { path: 'cutting-page', component: CuttingPageComponent, canActivate: [AuthGuard]  },
    { path: 'printing-page', component: PrintPageComponent, canActivate: [AuthGuard]  },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
