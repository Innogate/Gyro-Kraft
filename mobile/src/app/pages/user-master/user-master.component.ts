import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { UserService } from '../../services/user.service';
import { SweetAlertService } from '../../utility/sweet-alert.service';
import { firstValueFrom, tap } from 'rxjs';
import { debug } from '../../utility/function';
import { allUsersResponse } from '../../services/interface/user';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-user-master',
    imports: [CardModule, ButtonModule, UserCardComponent, CommonModule],
    templateUrl: './user-master.component.html',
    styleUrl: './user-master.component.scss'
})
export class UserMasterComponent implements OnInit {
    users: allUsersResponse | undefined;

    constructor(
        private service: UserService,
        private alert: SweetAlertService
    ) { }
    async ngOnInit() {
        await firstValueFrom(this.service.getAllUsers({
            max: 100,
            current: 0
        }).pipe(
            tap(
                (response) => {
                    if (response.status == 200) {
                        this.users = response.body;
                    }
                },
                (error) => {
                    this.alert.errorAlert(error.error.message, error.error.body);
                }
            )
        ))
    }
}
