import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        SweetAlert2Module

    ],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
