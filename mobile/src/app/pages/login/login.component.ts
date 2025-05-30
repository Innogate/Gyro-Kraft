import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, tap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { debug } from '../../utility/function';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SweetAlertService } from '../../utility/sweet-alert.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [CommonModule, ButtonModule, FormsModule, InputTextModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  mobile: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private service: UserService,
    private alert: SweetAlertService,
    private router: Router
  ) {}

  async onSubmit(form: any) {
    if (form.invalid) return;

    const loginData = {
      mobile: this.mobile,
      password: this.password
    };
    await firstValueFrom(this.service.userLogin(loginData).pipe(
      tap(
        (response) => {
            debug(response);
            if (response.status == 200 && response.body.otp_id) {
                this.router.navigate(['/otp/'+response.body.otp_id]);
            }
        },
        (error) => {
          this.alert.errorAlert(error.error.message, error.error.body);
        }
    )
    ));
  }

  showOtpBox() {
    // Show OTP form and hide login box
    console.log('OTP Box shown');
  }

}
