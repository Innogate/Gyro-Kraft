import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { firstValueFrom, tap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { SweetAlertService } from '../../utility/sweet-alert.service';
import { debug } from '../../utility/function';

@Component({
  selector: 'app-login-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
  templateUrl: './login-otp.component.html',
  styleUrls: ['./login-otp.component.scss'],
})
export class LoginOtpComponent implements OnInit {
  otpDigits: string[] = ['', '', '', '', '', '']; // 6-digit OTP
  errorMessage: string = '';
  loading: boolean = false;
  otp_id: string | null = null;

  cooldown: number = 0; // seconds remaining
  cooldownDuration: number = 30; // change this to any seconds you want
  cooldownInterval: any;
  otp: string = '';
  constructor(
    private route: ActivatedRoute,
    private service: UserService,
    private alert: SweetAlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.startCooldown();
    this.otp_id = this.route.snapshot.paramMap.get('OTPid');

    // Optional: Focus first field
    setTimeout(() => {
      const firstInput = document.getElementById('otp-0');
      if (firstInput) (firstInput as HTMLInputElement).focus();
    });
  }
  
  onOtpInput(): void {
    this.otp = this.otp.replace(/\D/g, '').slice(0, 6);
    if (this.otp.length === 6) {
      this.submitOtp();
      
    }
  }

  get isOtpIncomplete(): boolean {
    return this.otpDigits.some(d => !d);
  }

  async submitOtp() {
    if (this.otp.length !== 6) {
      this.errorMessage = 'Please enter all 6 digits of OTP.';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

  
    if (this.otp_id) {
      await firstValueFrom(this.service.loginOTPVerify({ otp_id: this.otp_id, otp: this.otp }).pipe(
        tap(
          (response) => {
            debug(response);
            if (response.status == 200 && response.body.token) {
              localStorage.setItem('token', response.body.token);
              this.router.navigate(['/']);
            }
          },
          (error) => {
            this.alert.errorAlert(error.error.message, error.error.body);
          }
        )
      ));
    }
  }

  resendOtp(): void {
    if (this.cooldown > 0) return;
    this.otpDigits = ['', '', '', '', '', ''];
    this.errorMessage = '';
    this.startCooldown();
  }

  startCooldown(): void {
    this.cooldown = this.cooldownDuration;
    clearInterval(this.cooldownInterval);

    this.cooldownInterval = setInterval(() => {
      this.cooldown -= 1;
      if (this.cooldown <= 0) {
        clearInterval(this.cooldownInterval);
      }
    }, 1000);
  }
}
