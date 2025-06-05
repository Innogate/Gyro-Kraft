import { Component, Input, OnInit } from '@angular/core';
import { userCreateResponse } from '../../services/interface/user';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-user-card',
  imports: [CommonModule,TableModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
    constructor(private router: Router) {}
    // take input user
    @Input() users: userCreateResponse | null = null;

    updateInfo() {
        if (this.users) {
            this.router.navigate(['/pages/create-user'], {
                queryParams: { user_data: JSON.stringify(this.users) }
              });
        }
    }
}
